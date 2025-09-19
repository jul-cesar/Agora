
FROM ghcr.io/puppeteer/puppeteer:latest


USER root 
RUN npm install -g pnpm
USER pptruser



WORKDIR /app


COPY package.json pnpm-lock.yaml ./


RUN pnpm install --frozen-lockfile


COPY . .


RUN pnpm run build


EXPOSE 3000


CMD [ "pnpm", "run", "dev" ]