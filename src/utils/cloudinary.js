const cloudinary = require('cloudinary').v2;
require("dotenv").config;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
    secure: true
});

const uploadImage = async (imagePath, publicId) => {
    const result = await cloudinary.uploader.upload(imagePath, {
        public_id: publicId
    });
    return result;
};

module.exports = uploadImage;