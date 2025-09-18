const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
    {
        carImages: [{ type: String }],
        video: { type: String },
        insuranceImage: { type: String },
        pollutionImage: { type: String },
        taxTokenImage: { type: String },
        rcBookImage: { type: String },
        status: { type: String, enum: ["pending", "approve", "reject"], default: "pending" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Car", carSchema);


