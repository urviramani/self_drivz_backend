const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
        },
        contactNumber: {
            type: String,
            required: true,
            trim: true,
        },
        role: {
            type: String,
            enum: ["admin", "user", "rider"],
            default: "user",
        },
        bio: {
            type: String,
            trim: true,
        },
        selfie: {
            type: String, // single image URL
        },
        aadharcard: {
            frontside: { type: String },
            backside: { type: String },
        },
        drivingLicense: {
            frontside: { type: String },
            backside: { type: String },
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
