const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { uploadFile } = require("../utils/uploadSingleFile");

// Create a new user
const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single user by id
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Update user: payload + optional file uploads; handle isRider -> role
const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const updates = { ...req.body };

        // Normalize booleans possibly coming as strings
        if (typeof updates.isRider !== "undefined") {
            const isRiderBool = String(updates.isRider).toLowerCase() === "true";
            if (isRiderBool) {
                updates.role = "rider";
            } else {
                // Explicit false: inform client; do not change role
                delete updates.role;
            }
            delete updates.isRider;
        }

        // Handle uploaded files from multer.fields
        // Expected field names: selfie, aadharFront, aadharBack, dlFront, dlBack
        if (req.files) {
            // Selfie
            if (req.files.selfie && req.files.selfie[0]) {
                const url = await uploadFile(req.files.selfie[0].buffer);
                updates.selfie = url;
            }

            // Aadhar
            const aadharFront = req.files.aadharFront && req.files.aadharFront[0] ? req.files.aadharFront[0].buffer : null;
            const aadharBack = req.files.aadharBack && req.files.aadharBack[0] ? req.files.aadharBack[0].buffer : null;
            if (aadharFront || aadharBack) {
                const aadharUpdate = { ...user.aadharcard };
                if (aadharFront) aadharUpdate.frontside = await uploadFile(aadharFront);
                if (aadharBack) aadharUpdate.backside = await uploadFile(aadharBack);
                updates.aadharcard = aadharUpdate;
            }

            // Driving License
            const dlFront = req.files.dlFront && req.files.dlFront[0] ? req.files.dlFront[0].buffer : null;
            const dlBack = req.files.dlBack && req.files.dlBack[0] ? req.files.dlBack[0].buffer : null;
            if (dlFront || dlBack) {
                const dlUpdate = { ...user.drivingLicense };
                if (dlFront) dlUpdate.frontside = await uploadFile(dlFront);
                if (dlBack) dlUpdate.backside = await uploadFile(dlBack);
                updates.drivingLicense = dlUpdate;
            }
        }

        Object.assign(user, updates);
        await user.save();

        const info = [];
        if (typeof req.body.isRider !== "undefined") {
            if (String(req.body.isRider).toLowerCase() === "true") {
                info.push("Role updated to rider");
            } else {
                info.push("isRider is false; role unchanged");
            }
        }

        res.status(200).json({ success: true, data: user, info });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        res.status(200).json({ success: true, message: "User deleted" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Login with contactNumber; create if not exists; return JWT
const login = async (req, res) => {
    try {
        const { contactNumber, name, email } = req.body;
        if (!contactNumber) return res.status(400).json({ success: false, message: "contactNumber is required" });

        let user = await User.findOne({ contactNumber });
        if (!user) {
            user = await User.create({ contactNumber, name, email });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "dev_secret", { expiresIn: "7d" });
        res.status(200).json({ success: true, token, data: user });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    login,
};


