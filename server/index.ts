import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import mysql from 'mysql2/promise';
import { v2 as cloudinary } from 'cloudinary';

const app = express();
const port = Number(process.env.PORT || 8787);
const allowedOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: allowedOrigin }));
app.use(express.json({ limit: '2mb' }));

const caPath = process.env.TIDB_CA_PATH;
const pool = mysql.createPool({
  host: process.env.TIDB_HOST,
  port: Number(process.env.TIDB_PORT || 4000),
  user: process.env.TIDB_USER,
  password: process.env.TIDB_PASSWORD,
  database: process.env.TIDB_DATABASE || 'sys',
  ssl: caPath ? { ca: fs.readFileSync(path.resolve(caPath)) } : undefined,
  waitForConnections: true,
  connectionLimit: 5,
  enableKeepAlive: true,
});

cloudinary.config({ secure: true });

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true, tidb: true, cloudinary: Boolean(process.env.CLOUDINARY_URL) });
  } catch (error) {
    console.error(error);
    res.status(503).json({ ok: false, tidb: false });
  }
});

// The UI can persist its existing local state as one JSON document while the
// schema is being normalised. The database connection and credentials remain server-side.
app.get('/api/state', async (_req, res) => {
  try {
    const [rows] = await pool.query<mysql.RowDataPacket[]>(
      'SELECT state_json FROM app_state WHERE state_key = ?',
      ['albirru'],
    );
    res.json(rows[0]?.state_json || {});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal membaca data TiDB.' });
  }
});

app.put('/api/state', async (req, res) => {
  try {
    const state = req.body;
    if (!state || typeof state !== 'object' || Array.isArray(state)) {
      return res.status(400).json({ message: 'Payload state tidak valid.' });
    }
    await pool.query(
      'INSERT INTO app_state (state_key, state_json) VALUES (?, ?) ON DUPLICATE KEY UPDATE state_json = VALUES(state_json)',
      ['albirru', JSON.stringify(state)],
    );
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal menyimpan data ke TiDB.' });
  }
});

// Generate a short-lived signed upload signature. The Cloudinary secret never reaches the browser.
app.post('/api/cloudinary/signature', (_req, res) => {
  const timestamp = Math.round(Date.now() / 1000);
  const folder = 'albirru/class-reports';
  const signature = cloudinary.utils.api_sign_request({ timestamp, folder }, cloudinary.config().api_secret!);
  res.json({ timestamp, folder, signature, cloudName: cloudinary.config().cloud_name, apiKey: cloudinary.config().api_key });
});

app.listen(port, () => console.log(`Albirru API listening on http://localhost:${port}`));
