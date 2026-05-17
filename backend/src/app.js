/**
 * Express-App – Routen und Middleware.
 * Wird von server.js gestartet, damit der Import in Tests einfach bleibt.
 */

const express = require('express');
const os      = require('os');
const path    = require('path');
const logger  = require('./logger');
const tasks   = require('./routes/tasks');

const app = express();

app.use(express.json());

// Statisches Frontend aus dem public-Ordner bereitstellen
app.use(express.static(path.join(__dirname, '..', 'public')));

// Jede Anfrage kurz loggen
app.use((req, _res, next) => {
  logger.info('Eingehende Anfrage', { method: req.method, path: req.path });
  next();
});

// ── Einfache Info-Endpunkte ────────────────────────────────────────────────

app.get('/api/health', (_req, res) => {
  res.json({ status: 'healthy' });
});

app.get('/api/info', (_req, res) => {
  res.json({
    name:  'Venurshan Manivannan',
    class: 'HF2024A',
    hobby: 'Gaming',
  });
});

app.get('/api/status', (_req, res) => {
  res.json({
    hostname:  os.hostname(),
    appName:   process.env.APP_NAME    || 'Task Notes App',
    version:   process.env.APP_VERSION || '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ── Suche ─────────────────────────────────────────────────────────────────

const { pool } = require('./db');

app.get('/api/search', async (req, res, next) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: 'Query-Parameter fehlt' });
  try {
    const pattern = `%${query}%`;
    const result = await pool.query(
      'SELECT * FROM tasks WHERE title ILIKE $1 OR description ILIKE $1 ORDER BY created_at DESC',
      [pattern]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// ── Task-Routen ────────────────────────────────────────────────────────────

app.use('/api/tasks', tasks);

// ── Fehlerbehandlung ──────────────────────────────────────────────────────

// Zentraler Error-Handler – gibt Fehlermeldung als JSON zurück
app.use((err, _req, res, _next) => {
  logger.error('Serverfehler', { message: err.message });
  res.status(500).json({ error: 'Interner Serverfehler' });
});

module.exports = app;
