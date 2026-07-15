# --- Étape 1 : build de l'application React/Vite ---
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Requests are proxied by nginx inside the Compose network.  Do not bake
# localhost service URLs into the browser bundle: there, localhost is the
# visitor's machine rather than a Docker service.
ARG VITE_API_BOOKS_URL=/api/livres
ARG VITE_API_USERS_URL=/api/utilisateurs
ARG VITE_API_LOANS_URL=/api/emprunts
ARG VITE_USE_MOCKS=false

ENV VITE_API_BOOKS_URL=$VITE_API_BOOKS_URL
ENV VITE_API_USERS_URL=$VITE_API_USERS_URL
ENV VITE_API_LOANS_URL=$VITE_API_LOANS_URL
ENV VITE_USE_MOCKS=$VITE_USE_MOCKS

RUN npm run build

# --- Étape 2 : servir les fichiers statiques avec nginx ---
FROM nginx:1.27-alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
