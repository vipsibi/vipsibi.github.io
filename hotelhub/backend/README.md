# HotelHub backend

## PostgreSQL setup

1. Create a database named `hotelhub` in pgAdmin or `psql`:

```sql
CREATE DATABASE hotelhub;
```

2. Copy `.env.example` to `.env` and replace `YOUR_PASSWORD` with the password created during PostgreSQL installation.

3. Start the API:

```powershell
npm run dev
```

The API runs at `http://localhost:5000`. The `hotels` table and six starter hotels are created automatically on first start.

The frontend expects the API at `http://localhost:5000/api`. Set `VITE_USE_MOCK=true` in the frontend environment only when practicing without PostgreSQL.