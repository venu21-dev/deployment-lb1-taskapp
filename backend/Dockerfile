# ── Stage 1: Abhängigkeiten installieren ─────────────────────────────────────
FROM node:24-alpine AS deps

WORKDIR /app

# Zuerst nur package.json kopieren – Docker cached diese Schicht,
# solange sich die Abhängigkeiten nicht ändern.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ── Stage 2: Produktions-Image ────────────────────────────────────────────────
FROM node:24-alpine AS runner

WORKDIR /app

# Nur die fertigen node_modules aus Stage 1 kopieren
COPY --from=deps /app/node_modules ./node_modules

# Quellcode kopieren (ohne alles, was in .dockerignore steht)
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
