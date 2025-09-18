const express = require("express");
const { createCar, getCars, getCarById, updateCar, deleteCar, updateCarStatus } = require("../controllers/Car");
const { uploadCarAssets } = require("../middlewares/upload");
const auth = require("../middlewares/auth");
const { requireAdmin } = require("../middlewares/auth");

const router = express.Router();

router.post("/", auth, uploadCarAssets, createCar);
router.get("/", auth, getCars);
router.get("/:id", auth, getCarById);
router.put("/:id", auth, uploadCarAssets, updateCar);
router.delete("/:id", auth, deleteCar);
router.patch("/:id/status", auth, requireAdmin, updateCarStatus);

module.exports = router;


