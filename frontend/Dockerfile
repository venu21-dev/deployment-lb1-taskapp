# Frontend Dockerfile – Nginx liefert die statischen Dateien aus
FROM nginx:alpine

# Eigene Nginx-Konfiguration kopieren (überschreibt die Standard-Config)
COPY nginx.conf /etc/nginx/nginx.conf

# Statische Frontend-Dateien in den Nginx-Webroot kopieren
COPY index.html style.css app.js /usr/share/nginx/html/

EXPOSE 80
