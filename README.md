# Task Notes App – Deployment LB1

Einfache Task-/Notizen-App als Basis für das Deployment-Modul (HF).

**Technologie-Stack:**
- Backend: Node.js / Express
- Datenbank: PostgreSQL (`pg`)
- Frontend: HTML, CSS, Vanilla JS (kein Framework)
- Container: Docker (Dockerfile vorhanden)

---

## Projektstruktur

```
deployment-lb1-taskapp/
├── backend/
│   ├── src/
│   │   ├── app.js          ← Express-App (Routen, Middleware)
│   │   ├── db.js           ← Datenbankverbindung & Init
│   │   ├── logger.js       ← Einfacher JSON-Logger
│   │   └── routes/
│   │       └── tasks.js    ← Task-API-Routen
│   ├── public/             ← Statisches Frontend
│   │   ├── index.html
│   │   ├── style.css
│   │   └── app.js
│   ├── tests/
│   │   └── logger.test.js  ← Einfacher Logger-Test
│   ├── server.js           ← Einstiegspunkt
│   ├── package.json
│   ├── Dockerfile
│   ├── .dockerignore
│   └── .env.example
└── .gitignore
```

---

## Lokale Einrichtung

### Voraussetzungen

- Node.js >= 18
- PostgreSQL (lokal oder via Docker)

### 1. Abhängigkeiten installieren

```bash
cd backend
npm install
```

### 2. Umgebungsvariablen einrichten

```bash
cp .env.example .env
# .env anpassen (DB-Verbindungsdaten eintragen)
```

### 3. Server starten

```bash
# Produktion
npm start

# Entwicklung (mit Auto-Reload)
npm run dev
```

Die App ist dann unter **http://localhost:3000** erreichbar.

---

## Umgebungsvariablen

| Variable      | Standard        | Beschreibung                  |
|---------------|-----------------|-------------------------------|
| `PORT`        | `3000`          | HTTP-Port des Servers         |
| `APP_NAME`    | `Task Notes App`| Anzeigename der App           |
| `APP_VERSION` | `1.0.0`         | Versionsnummer                |
| `DB_HOST`     | –               | PostgreSQL-Host               |
| `DB_PORT`     | `5432`          | PostgreSQL-Port               |
| `DB_USER`     | –               | Datenbankbenutzer             |
| `DB_PASSWORD` | –               | Datenbankpasswort             |
| `DB_NAME`     | –               | Datenbankname                 |

---

## API-Endpunkte

| Methode | Pfad                  | Beschreibung                    |
|---------|-----------------------|---------------------------------|
| GET     | `/api/health`         | Gesundheitsstatus der App       |
| GET     | `/api/info`           | Entwickler-Infos                |
| GET     | `/api/status`         | Hostname, App-Name, Version     |
| GET     | `/api/tasks`          | Alle Tasks zurückgeben          |
| POST    | `/api/tasks`          | Neuen Task erstellen            |
| GET     | `/api/tasks/:id`      | Einzelnen Task abrufen          |
| DELETE  | `/api/tasks/:id`      | Task löschen                    |
| GET     | `/api/search?query=…` | Tasks nach Titel/Beschreibung suchen |

### Beispiel: Task erstellen

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Aufgabe 1", "description": "Erste Aufgabe"}'
```

---

## Tests

```bash
cd backend
npm test
```

Der Test prüft den eingebauten JSON-Logger (kein externes Test-Framework nötig, nutzt `node:test`).

---

## Docker

### Image bauen

```bash
cd backend
docker build -t taskapp:local .
```

### Container starten

```bash
docker run -p 3000:3000 \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=5432 \
  -e DB_USER=taskuser \
  -e DB_PASSWORD=geheimespasswort \
  -e DB_NAME=taskdb \
  taskapp:local
```

> **Hinweis:** `host.docker.internal` verweist aus dem Container auf den Host-Rechner (funktioniert unter Docker Desktop für Windows/Mac). Unter Linux muss `--add-host=host.docker.internal:host-gateway` ergänzt werden.

---

## Nächste Schritte (Challenges)

Dieses Projekt ist die Grundlage für drei Deployment-Challenges:

| Challenge | Inhalt                                      | Status        |
|-----------|---------------------------------------------|---------------|
| **C1**    | Docker Compose (App + Datenbank zusammen)   | Noch nicht implementiert |
| **C2**    | GitHub Actions CI/CD Pipeline               | Noch nicht implementiert |
| **C3**    | Cloud-Deployment                            | Noch nicht implementiert |

Jede Challenge wird Schritt für Schritt auf dieser Basis aufgebaut.
