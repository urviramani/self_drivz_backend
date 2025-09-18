const Car = require("../models/Car");
const { uploadFile } = require("../utils/uploadSingleFile");
const { uploadMultipleFiles } = require("../utils/uploadMultipleFiles");

// Helper: upload optional single buffer
const maybeUpload = async (fileArray) => {
    if (fileArray && fileArray[0] && fileArray[0].buffer) {
        return uploadFile(fileArray[0].buffer);
    }
    return undefined;
};

// Create car with media (multipart)
const createCar = async (req, res) => {
    try {
        const data = {};

        // Multiple images
        if (req.files && req.files.carImages && req.files.carImages.length) {
            const buffers = req.files.carImages.map((f) => f.buffer);
            data.carImages = await uploadMultipleFiles(buffers);
        }

        // Single media
        data.video = await maybeUpload(req.files && req.files.video);
        data.insuranceImage = await maybeUpload(req.files && req.files.insuranceImage);
        data.pollutionImage = await maybeUpload(req.files && req.files.pollutionImage);
        data.taxTokenImage = await maybeUpload(req.files && req.files.taxTokenImage);
        data.rcBookImage = await maybeUpload(req.files && req.files.rcBookImage);

        const car = await Car.create(data);
        res.status(201).json({ success: true, data: car });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get all cars
const getCars = async (req, res) => {
    try {
        const cars = await Car.find();
        res.status(200).json({ success: true, data: cars });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get car by id
const getCarById = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) return res.status(404).json({ success: false, message: "Car not found" });
        res.status(200).json({ success: true, data: car });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Update car: can replace any provided media
const updateCar = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) return res.status(404).json({ success: false, message: "Car not found" });

        const updates = {};

        if (req.files) {
            if (req.files.carImages && req.files.carImages.length) {
                const buffers = req.files.carImages.map((f) => f.buffer);
                updates.carImages = await uploadMultipleFiles(buffers);
            }
            const videoUrl = await maybeUpload(req.files.video);
            if (videoUrl) updates.video = videoUrl;
            const insuranceUrl = await maybeUpload(req.files.insuranceImage);
            if (insuranceUrl) updates.insuranceImage = insuranceUrl;
            const pollutionUrl = await maybeUpload(req.files.pollutionImage);
            if (pollutionUrl) updates.pollutionImage = pollutionUrl;
            const taxTokenUrl = await maybeUpload(req.files.taxTokenImage);
            if (taxTokenUrl) updates.taxTokenImage = taxTokenUrl;
            const rcBookUrl = await maybeUpload(req.files.rcBookImage);
            if (rcBookUrl) updates.rcBookImage = rcBookUrl;
        }

        Object.assign(car, updates);
        await car.save();
        res.status(200).json({ success: true, data: car });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete car
const deleteCar = async (req, res) => {
    try {
        const car = await Car.findByIdAndDelete(req.params.id);
        if (!car) return res.status(404).json({ success: false, message: "Car not found" });
        res.status(200).json({ success: true, message: "Car deleted" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Admin: update status
const updateCarStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!status || !["pending", "approve", "reject"].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }
        const car = await Car.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );
        if (!car) return res.status(404).json({ success: false, message: "Car not found" });
        res.status(200).json({ success: true, data: car });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = { createCar, getCars, getCarById, updateCar, deleteCar, updateCarStatus };


