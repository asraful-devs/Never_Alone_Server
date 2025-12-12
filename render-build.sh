# !/usr/bin/env bash
# exit on error
set -o errexit

npm install --save-dev @types/express @types/cors @types/cookie-parser @types/bcrypt @types/jsonwebtoken @types/multer @types/nodemailer
npm install

# render-build.sh
npm install
npx prisma generate --schema=./prisma/schema
echo "TypeScript build skipped for deployment"

npm run build
npx prisma generate
npx prisma migrate deploy
