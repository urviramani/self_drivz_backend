const multer = require("multer");

// Memory storage to access file buffers for Cloudinary upload_stream
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed"), false);
    }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });

// Fields-based upload for combined update route
// Expected fields: selfie (single), aadharFront, aadharBack, dlFront, dlBack
const uploadUserDocuments = upload.fields([
    { name: "selfie", maxCount: 1 },
    { name: "aadharFront", maxCount: 1 },
    { name: "aadharBack", maxCount: 1 },
    { name: "dlFront", maxCount: 1 },
    { name: "dlBack", maxCount: 1 },
]);

module.exports = { uploadUserDocuments };

// Car assets: multiple carImages, plus single images and a video
const carFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image and video files are allowed"), false);
    }
};

const carUpload = multer({ storage, fileFilter: carFileFilter, limits: { fileSize: 100 * 1024 * 1024 } });

const uploadCarAssets = carUpload.fields([
    { name: "carImages", maxCount: 10 },
    { name: "video", maxCount: 1 },
    { name: "insuranceImage", maxCount: 1 },
    { name: "pollutionImage", maxCount: 1 },
    { name: "taxTokenImage", maxCount: 1 },
    { name: "rcBookImage", maxCount: 1 },
]);

module.exports.uploadCarAssets = uploadCarAssets;


