import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pkg from 'pg';

const { Pool } = pkg;

const app = express();
const PORT = Number(process.env.PORT || 10000);
const ADMIN_PIN = process.env.ADMIN_PIN || '2012';
const CORS_ORIGIN = (process.env.CORS_ORIGIN || '*').split(',').map(v => v.trim()).filter(Boolean);

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is missing');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

app.use(cors({
  origin(origin, callback) {
    if (!origin || CORS_ORIGIN.includes('*') || CORS_ORIGIN.includes(origin)) return callback(null, true);
    return callback(new Error('CORS blocked'));
  }
}));
app.use(express.json({ limit: '1mb' }));

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS reserves (
      id BIGSERIAL PRIMARY KEY,
      booking_id TEXT NOT NULL UNIQUE,
      product TEXT NOT NULL,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      size TEXT,
      time TEXT,
      comment TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

function requireAdmin(req, res, next) {
  const pin = req.get('x-admin-pin');
  if (!pin || pin !== ADMIN_PIN) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  next();
}

function makeBookingId() {
  return `KUBA-${Math.floor(1000 + Math.random() * 9000)}`;
}

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'db_unavailable' });
  }
});

app.post('/api/reserves', async (req, res) => {
  try {
    const { product, name, phone, size = '', time = '', comment = '' } = req.body || {};
    if (!product || !name || !phone) {
      return res.status(400).json({ error: 'missing_required_fields' });
    }

    let bookingId = makeBookingId();
    for (let i = 0; i < 5; i += 1) {
      try {
        const inserted = await pool.query(
          `INSERT INTO reserves (booking_id, product, name, phone, size, time, comment)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING booking_id, product, name, phone, size, time, comment, created_at`,
          [bookingId, product, name, phone, size, time, comment]
        );
        return res.status(201).json({
          bookingId: inserted.rows[0].booking_id,
          createdAt: inserted.rows[0].created_at
        });
      } catch (error) {
        if (error.code === '23505') {
          bookingId = makeBookingId();
          continue;
        }
        throw error;
      }
    }

    return res.status(500).json({ error: 'booking_id_generation_failed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'server_error' });
  }
});

app.get('/api/reserves', requireAdmin, async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT booking_id AS "bookingId", product, name, phone, size, time, comment, created_at AS "createdAt"
       FROM reserves
       ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'server_error' });
  }
});

initDb()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`KUBA backend listening on ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Failed to init database', error);
    process.exit(1);
  });
