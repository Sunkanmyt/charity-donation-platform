const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file buffer directly to Cloudinary
 * @param {Buffer} fileBuffer - File buffer from multer memoryStorage
 * @param {String} folder - Cloudinary folder name
 * @returns {Promise<String>} Secure URL of uploaded image
 */
const uploadToCloudinary = (fileBuffer, folder = "charity_campaigns") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      },
    );

    // Write file buffer into the stream
    uploadStream.end(fileBuffer);
  });
};

module.exports = { cloudinary, uploadToCloudinary };
