#!/bin/sh
set -e

npx prisma db push --skip-generate
npx tsx prisma/seed.ts

exec "$@"
