# TinyLink

TinyLink — a minimal URL shortener (Bitly-like) built with Node.js, Express and PostgreSQL.

## What’s included
- Express backend (server.js)
- PostgreSQL helper (db.js) + queries (queries.js)
- Migration SQL (migrations/001_create_links_table.sql)
- Frontend in `public/` (index.html, stats.html, 404.html, styles.css, app.js, stats.js)
- .env.example and deployment notes

## Quickstart (local)

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` and set `DATABASE_URL`.

3. Start server:

```bash
npm start
```

4. Open http://localhost:3000

## API Endpoints
- POST   /api/links         (create link — 409 if code exists)
- GET    /api/links         (list links)
- GET    /api/links/:code   (get stats)
- DELETE /api/links/:code   (delete)
- GET    /:code             (redirect — increments clicks)
- GET    /code/:code        (stats page)
- GET    /healthz           (health check)

## Deploy
See deployment notes in the file for Render / Railway. Ensure `DATABASE_URL` env var is set and run the migration once.
