import express from "express";
import dotenv from "dotenv";
import { nanoid } from "nanoid";
import pg from "pg";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const { Pool } = pg;

// __dirname fix for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ------------------------------
// API Routes
// ------------------------------

app.post("/api/links", async (req, res) => {
  try {
    const { target_url, code } = req.body;
    const shortcode = code || nanoid(6);

    const exists = await pool.query(
      "SELECT code FROM links WHERE code = $1",
      [shortcode]
    );

    if (exists.rows.length > 0) {
      return res.status(409).json({ error: "Shortcode already exists" });
    }

    await pool.query(
      "INSERT INTO links (code, target_url) VALUES ($1, $2)",
      [shortcode, target_url]
    );

    res.status(201).json({ code: shortcode });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/links", async (req, res) => {
  const result = await pool.query(
    "SELECT code, target_url, total_clicks, last_clicked FROM links ORDER BY created_at DESC"
  );
  res.json(result.rows);
});

app.get("/api/links/:code", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM links WHERE code = $1",
    [req.params.code]
  );

  if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });

  res.json(result.rows[0]);
});

app.delete("/api/links/:code", async (req, res) => {
  await pool.query("DELETE FROM links WHERE code = $1", [req.params.code]);
  res.json({ deleted: true });
});

// ------------------------------
// Redirect Handler
// ------------------------------

app.get("/:code", async (req, res) => {
  const code = req.params.code;

  const result = await pool.query(
    "SELECT * FROM links WHERE code = $1",
    [code]
  );

  if (result.rows.length === 0) {
    return res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
  }

  await pool.query(
    `UPDATE links 
     SET total_clicks = total_clicks + 1,
         last_clicked = NOW()
     WHERE code = $1`,
    [code]
  );

  res.redirect(result.rows[0].target_url);
});

// ------------------------------
app.get("/healthz", (req, res) => {
  res.status(200).json({ ok: true, version: "1.0" });
});

app.get("/code/:code", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "stats.html"));
});

// ------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`TinyLink running on port ${PORT}`));
