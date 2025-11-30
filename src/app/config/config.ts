import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    saltRounds: Number(process.env.saltRounds),
    jwt: {
        access_secret: process.env.jwt_access_secret,
        refresh_secret: process.env.jwt_refresh_secret,
        access_expires_in: process.env.jwt_access_expires_in,
        refresh_expires_in: process.env.jwt_refresh_expires_in,
    },
    cloudinary: {
        cloud_name: process.env.cloudinary_cloud_name,
        api_key: process.env.cloudinary_api_key,
        api_secret: process.env.cloudinary_api_secret,
    },
};
