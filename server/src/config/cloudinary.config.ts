import { v2 as cloudinary } from 'cloudinary';
import env from './env';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true
});

export const cloudinaryUpload = async (file: string, options: any = {}) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: env.CLOUDINARY_FOLDER,
      resource_type: 'auto',
      ...options
    });
    return {
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      resource_type: result.resource_type,
      bytes: result.bytes
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

export const cloudinaryDelete = async (publicId: string, options: any = {}) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, options);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
};

export default cloudinary;
