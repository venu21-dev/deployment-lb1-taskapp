/**
 * Routen für die Task-Verwaltung.
 * Alle Datenbankzugriffe laufen über den pg-Pool aus db.js.
 */

const express = require('express');
const { pool } = require('../db');

const router = express.Router();

// Alle Tasks zurückgeben
router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// Einen Task nach ID zurückgeben
router.get('/:id', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Task nicht gefunden' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// Neuen Task erstellen
router.post('/', async (req, res, next) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ error: 'Titel ist erforderlich' });
  try {
    const result = await pool.query(
      'INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *',
      [title, description || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// Task löschen
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Task nicht gefunden' });
    res.json({ deleted: result.rows[0].id });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
