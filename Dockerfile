# syntax=docker/dockerfile:1

FROM node:22-alpine

WORKDIR /app

# python3/make/g++ are needed to compile better-sqlite3's native addon.
RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

COPY . .

# The generated client (src/generated/prisma) must exist before next build:
# server components import it at build time.
RUN npx prisma generate

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh && mkdir -p /data

EXPOSE 3000
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "start"]
