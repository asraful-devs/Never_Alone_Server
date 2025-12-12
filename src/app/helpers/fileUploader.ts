import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import path from 'path';
import config from '../config/config';

type MulterFile = Express.Multer.File;

// Multer disk storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), '/uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    },
});

const upload = multer({ storage });

// Correct type for Multer file
const uploadToCloudinary = async (file: any) => {
    // Cloudinary configuration
    cloudinary.config({
        cloud_name: config.cloudinary.cloud_name,
        api_key: config.cloudinary.api_key,
        api_secret: config.cloudinary.api_secret,
    });

    try {
        const uploadResult = await cloudinary.uploader.upload(file.path, {
            public_id: file.filename,
        });
        return uploadResult;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw error;
    }
};

export const fileUploader = {
    upload,
    uploadToCloudinary,
};
