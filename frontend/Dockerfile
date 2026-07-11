# --- Étape 1 : build de l'application React/Vite ---
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_API_BOOKS_URL=http://localhost:8081/api/livres
ARG VITE_API_USERS_URL=http://localhost:8082/api/utilisateurs
ARG VITE_API_LOANS_URL=http://localhost:8083/api/emprunts
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

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]