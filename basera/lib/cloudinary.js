import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file buffer to Cloudinary
 * @param {Buffer} fileBuffer - The file data as a buffer
 * @param {string} folder - Destination folder on Cloudinary
 * @returns {Promise<string>} The secure URL of the uploaded image
 */
export const uploadToCloudinary = (fileBuffer, folder = 'basera') => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    ).end(fileBuffer);
  });
};

export default cloudinary;
