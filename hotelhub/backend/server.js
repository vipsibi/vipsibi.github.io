import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import multer from 'multer';
import { initializeDatabase, pool } from './db.js';

const app = express();
const port = Number(globalThis.process.env.PORT || 5000);
const currentDir = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(currentDir, 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });
const fields = 'id, name, description, latitude, longitude, price, image, location_type AS "locationType", rating, reviews, created_at';

const upload = multer({
    storage: multer.diskStorage({
        destination: uploadDir,
        filename: (_request, file, callback) => callback(null, `${Date.now()}-${file.originalname.replace(/[^a-z0-9.-]/gi, '-')}`),
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_request, file, callback) => callback(null, ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)),
});



app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadDir));

const valuesFrom = (body, image) => [String(body.name || '').trim(), String(body.description || '').trim(), Number(body.latitude), Number(body.longitude), Number(body.price), image, ['city', 'beach'].includes(body.locationType) ? body.locationType : 'city'];
const validate = ([name, description, latitude, longitude, price, image, locationType]) => {
    if (!name || !description || !image || !['city', 'beach'].includes(locationType) || !Number.isFinite(latitude) || latitude < -90 || latitude > 90 || !Number.isFinite(longitude) || longitude < -180 || longitude > 180 || !Number.isFinite(price) || price <= 0) return 'Please provide valid hotel details, location, price, and an image';
    return null;
};

app.get('/api/health', (_request, response) => response.json({ ok: true }));
app.get('/api/hotels', async (request, response, next) => {
    try {
        const page = Math.max(1, Number(request.query.page) || 1);
        const limit = Math.min(6, Math.max(4, Number(request.query.limit) || 6));
        const params = [`%${String(request.query.search || '').trim()}%`];
        const filters = ['name ILIKE $1'];
        if (request.query.minPrice) { params.push(Number(request.query.minPrice)); filters.push(`price >= $${params.length}`); }
        if (request.query.maxPrice) { params.push(Number(request.query.maxPrice)); filters.push(`price <= $${params.length}`); }
        if (['city', 'beach'].includes(request.query.locationType)) { params.push(request.query.locationType); filters.push(`location_type = $${params.length}`); }
        const where = filters.join(' AND ');
        const count = await pool.query(`SELECT COUNT(*)::int AS total FROM hotels WHERE ${where}`, params);
        const total = count.rows[0].total;
        const offsetIndex = params.length + 1;
        const limitIndex = params.length + 2;
        const result = await pool.query(`SELECT ${fields} FROM hotels WHERE ${where} ORDER BY created_at DESC, id DESC LIMIT $${limitIndex} OFFSET $${offsetIndex}`, [...params, (page - 1) * limit, limit]);
        response.json({ hotels: result.rows, total, page, totalPages: Math.max(1, Math.ceil(total / limit)) });
    } catch (error) { next(error); }
});
app.get('/api/hotels/slug/:slug', async (request, response, next) => {
    try {
        const result = await pool.query(`SELECT ${fields} FROM hotels WHERE lower(regexp_replace(trim(name), '[^a-zA-Z0-9]+', '-', 'g')) = $1`, [request.params.slug.toLowerCase()]);
        if (!result.rowCount) return response.status(404).json({ message: 'Hotel not found' });
        response.json(result.rows[0]);
    } catch (error) { next(error); }
});
app.get('/api/hotels/:id', async (request, response, next) => {
    try {
        const result = await pool.query(`SELECT ${fields} FROM hotels WHERE id = $1`, [request.params.id]);
        if (!result.rowCount) return response.status(404).json({ message: 'Hotel not found' });
        response.json(result.rows[0]);
    } catch (error) { next(error); }
});
app.post('/api/hotels', upload.single('image'), async (request, response, next) => {
    try {
        const values = valuesFrom(request.body, request.file ? `/uploads/${request.file.filename}` : '');
        const error = validate(values);
        if (error) return response.status(400).json({ message: error });
        const result = await pool.query(`INSERT INTO hotels (name, description, latitude, longitude, price, image, location_type) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING ${fields}`, values);
        response.status(201).json(result.rows[0]);
    } catch (error) { next(error); }
});
app.put('/api/hotels/:id', upload.single('image'), async (request, response, next) => {
    try {
        const existing = await pool.query('SELECT image FROM hotels WHERE id = $1', [request.params.id]);
        if (!existing.rowCount) return response.status(404).json({ message: 'Hotel not found' });
        const values = valuesFrom(request.body, request.file ? `/uploads/${request.file.filename}` : existing.rows[0].image);
        const error = validate(values);
        if (error) return response.status(400).json({ message: error });
        const result = await pool.query(`UPDATE hotels SET name=$1, description=$2, latitude=$3, longitude=$4, price=$5, image=$6, location_type=$7 WHERE id=$8 RETURNING ${fields}`, [...values, request.params.id]);
        response.json(result.rows[0]);
    } catch (error) { next(error); }
});
app.delete('/api/hotels/:id', async (request, response, next) => {
    try {
        const result = await pool.query('DELETE FROM hotels WHERE id = $1 RETURNING image', [request.params.id]);
        if (!result.rowCount) return response.status(404).json({ message: 'Hotel not found' });
        if (result.rows[0].image?.startsWith('/uploads/')) fs.rmSync(path.join(currentDir, result.rows[0].image), { force: true });
        response.json({ message: 'Hotel deleted successfully' });
    } catch (error) { next(error); }
});
app.use((error, _request, response, next) => {
    void next;
    return response.status(500).json({ message: error.message || 'Server error' });
});
initializeDatabase().then(() => app.listen(port, () => console.log(`HotelHub backend running at http://localhost:${port}`))).catch((error) => { console.error(`PostgreSQL connection failed: ${error.message}`); globalThis.process.exitCode = 1; });