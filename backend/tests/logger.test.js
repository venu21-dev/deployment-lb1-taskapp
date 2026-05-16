/**
 * Einfacher Test für den Logger.
 * Nutzt den eingebauten Node.js Test-Runner – kein extra Paket nötig.
 */

const { test } = require('node:test');
const assert   = require('node:assert/strict');
const logger   = require('../src/logger');

test('Logger schreibt strukturiertes JSON auf stdout', () => {
  const ausgabe = [];
  const originalLog = console.log;

  // console.log temporär ersetzen, um die Ausgabe abzufangen
  console.log = (zeile) => ausgabe.push(JSON.parse(zeile));
  logger.info('Testmeldung', { extra: 'daten' });
  console.log = originalLog;

  const eintrag = ausgabe[0];
  assert.equal(eintrag.level,   'info');
  assert.equal(eintrag.message, 'Testmeldung');
  assert.equal(eintrag.extra,   'daten');
  assert.ok(eintrag.timestamp, 'Timestamp muss vorhanden sein');
});

test('Logger unterstützt die Level info, warn und error', () => {
  const ausgabe = [];
  const originalLog = console.log;
  console.log = (zeile) => ausgabe.push(JSON.parse(zeile));

  logger.info('a');
  logger.warn('b');
  logger.error('c');
  console.log = originalLog;

  assert.equal(ausgabe[0].level, 'info');
  assert.equal(ausgabe[1].level, 'warn');
  assert.equal(ausgabe[2].level, 'error');
});
