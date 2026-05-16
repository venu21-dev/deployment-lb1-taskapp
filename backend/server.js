/**
 * Einstiegspunkt des Servers.
 * Lädt Umgebungsvariablen, initialisiert die Datenbank und startet Express.
 */

require('dotenv').config();

const app    = require('./src/app');
const logger = require('./src/logger');
const { initDB } = require('./src/db');

const PORT = parseInt(process.env.PORT || '3000', 10);

async function start() {
  try {
    // Tabellen anlegen falls nötig
    await initDB();

    app.listen(PORT, () => {
      logger.info('Server gestartet', {
        port:    PORT,
        appName: process.env.APP_NAME    || 'Task Notes App',
        version: process.env.APP_VERSION || '1.0.0',
      });
    });
  } catch (err) {
    logger.error('Start fehlgeschlagen', { message: err.message });
    process.exit(1);
  }
}

start();
