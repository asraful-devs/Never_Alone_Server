# !/usr/bin/env bash
# exit on error
set -o errexit

npm install --save-dev @types/express @types/cors @types/cookie-parser @types/bcrypt @types/jsonwebtoken @types/multer @types/nodemailer
npm install
npm run build
npx prisma generate
npx prisma migrate deploy
