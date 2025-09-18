const express = require("express");
const {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    login,
} = require("../controllers/User");

const { uploadUserDocuments } = require("../middlewares/upload");
const auth = require("../middlewares/auth");

const router = express.Router();

// Auth
router.post("/login", login);

// Protected CRUD
router.post("/", auth, createUser);
router.get("/", auth, getUsers);
router.get("/:id", auth, getUserById);
router.put("/:id", auth, uploadUserDocuments, updateUser);
router.delete("/:id", auth, deleteUser);


module.exports = router;


