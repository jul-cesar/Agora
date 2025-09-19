# Usa una imagen base de Node.js
FROM node:20-alpine


RUN npm install -g pnpm

RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ttf-freefont \
    nodejs \
    tzdata # Aseguramos que tzdata esté disponible para la zona horaria

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

EXPOSE 3000

CMD [ "pnpm", "run", "dev" ]