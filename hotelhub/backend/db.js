import pg from 'pg';

const { Pool } = pg;
export const pool = new Pool({ connectionString: globalThis.process.env.DATABASE_URL });

const seedHotels = [
    ['Palmwater Overwater Villas', 'A calm lagoon escape with clear water, private villas, and slow mornings beyond the city lights.', 11.0168, 76.9558, 2500, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', 'beach', 4.5, 120],
    ['ERAMIKA Hilton City', 'A polished city base with quiet rooms, warm light, and everything close at hand.', 13.0827, 80.2707, 4000, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', 'city', 4.6, 98],
    ['City Central Hotel', 'Modern rooms with great amenities in the heart of the city.', 12.9716, 77.5946, 3200, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', 'city', 4.3, 76],
    ['Mountain Retreat', 'Peaceful stay with mountain view and cool weather.', 11.4064, 76.6932, 3500, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800', 'beach', 4.4, 54],
    ['Lake View Resort', 'Lake facing rooms and outdoor activities for a calm holiday.', 9.9312, 76.2673, 4300, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 'beach', 4.7, 88],
    ['Royal Heritage Hotel', 'Luxury rooms and royal interiors with premium service.', 10.7905, 78.7047, 5000, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', 'city', 4.8, 140],
];

export async function initializeDatabase() {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS hotels (
      id SERIAL PRIMARY KEY,
      name VARCHAR(160) NOT NULL,
      description VARCHAR(500) NOT NULL,
      latitude NUMERIC(9, 6) NOT NULL CHECK (latitude BETWEEN -90 AND 90),
      longitude NUMERIC(9, 6) NOT NULL CHECK (longitude BETWEEN -180 AND 180),
      price NUMERIC(12, 2) NOT NULL CHECK (price > 0),
      image TEXT NOT NULL,
      location_type VARCHAR(20) NOT NULL DEFAULT 'city' CHECK (location_type IN ('city', 'beach')),
      rating NUMERIC(2, 1) NOT NULL DEFAULT 4.5,
      reviews INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
    await pool.query("ALTER TABLE hotels ADD COLUMN IF NOT EXISTS location_type VARCHAR(20) NOT NULL DEFAULT 'city'");
    await pool.query("UPDATE hotels SET location_type = 'beach' WHERE name IN ('Palmwater Overwater Villas', 'Mountain Retreat', 'Lake View Resort')");
    const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM hotels');
    if (rows[0].count === 0) {
        for (const hotel of seedHotels) {
            await pool.query('INSERT INTO hotels (name, description, latitude, longitude, price, image, location_type, rating, reviews) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', hotel);
        }
    }
}