const dotenv = require('dotenv');

dotenv.config();

export const serviceName = String(process.env.SERVICE_NAME);
export const port = Number(process.env.PORT || 5000);

export const urlDb = String(process.env.MONGO_URL_LOCAL);

export const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME;
export const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY;
export const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET;
