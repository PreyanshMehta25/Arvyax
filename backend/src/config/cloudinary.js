const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary with your credentials from the .env file
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'arvyax-wellness-sessions', // A folder name in your Cloudinary account
    allowed_formats: ['jpg', 'png', 'jpeg'], // Allowed image formats
    transformation: [{ width: 500, height: 500, crop: 'limit' }], // Optional: resize images
  },
});

// Create the Multer upload instance
const upload = multer({ storage: storage });

module.exports = upload;