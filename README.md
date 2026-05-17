# Task Notes App – Deployment LB1

Eine kleine Task- und Notizen-App als Grundlage für das Deployment-Modul der HF Informatik.

Die App wird für drei LB1-Challenges verwendet:

- **C1:** Multi-Service-Architektur mit Docker Compose
- **C2:** CI/CD mit GitHub Actions
- **C3:** Cloud-Deployment auf Render

## Stack

- Backend: Node.js mit Express
- Datenbank: PostgreSQL
- Frontend: HTML, CSS und Vanilla JavaScript
- Container: Docker und Docker Compose
- CI/CD: GitHub Actions
- Cloud: Render

## Projektstruktur

```text
deployment-lb1-taskapp/
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   ├── nginx.conf
│   └── Dockerfile
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── db.js
│   │   ├── logger.js
│   │   └── routes/
│   │       └── tasks.js
│   ├── public/
│   ├── tests/
│   │   └── logger.test.js
│   ├── server.js
│   ├── package.json
│   ├── Dockerfile
│   └── .dockerignore
├── .github/
│   └── workflows/
│       └── ci-cd.yml
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md

C2 pipeline demo