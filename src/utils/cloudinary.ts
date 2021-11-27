import cloudinary from 'cloudinary';
import {
  cloudinaryCloudName,
  cloudinaryApiKey,
  cloudinaryApiSecret
} from '../config';

cloudinary.v2.config({
  cloud_name: cloudinaryCloudName,
  api_key: cloudinaryApiKey,
  api_secret: cloudinaryApiSecret
});

export default cloudinary.v2;
