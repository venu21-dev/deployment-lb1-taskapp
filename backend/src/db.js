/**
 * Datenbankverbindung und Initialisierung.
 * Verbindungsdaten kommen ausschliesslich aus Umgebungsvariablen.
 */

const { Pool } = require('pg');
const logger = require('./logger');

// Pool wird einmalig erstellt und wiederverwendet
const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     parseInt(process.env.DB_PORT || '5432', 10),
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

/**
 * Erstellt die Tabelle, falls sie noch nicht existiert.
 * Wird beim Start des Servers aufgerufen.
 */
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id          SERIAL PRIMARY KEY,
      title       TEXT NOT NULL,
      description TEXT,
      completed   BOOLEAN DEFAULT false,
      created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  logger.info('Datenbank initialisiert');
}

module.exports = { pool, initDB };
