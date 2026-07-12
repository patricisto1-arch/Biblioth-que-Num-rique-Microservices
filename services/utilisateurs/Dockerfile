FROM python:3.12-slim

WORKDIR /app

# curl requis pour le healthcheck
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN chown -R appuser:appgroup /app

USER appuser

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    FLASK_ENV=production \
    DB_HOST=db \
    DB_USER=postgres \
    DB_NAME=bibliotheque \
    DB_PORT=5432 \
    PORT=8002

EXPOSE 8002

# Forme shell (pas exec) pour permettre l'expansion de la variable $PORT,
# fournie par le docker-compose.yml de l'équipe (8002 pour ce service)
CMD gunicorn --bind 0.0.0.0:$PORT app:app