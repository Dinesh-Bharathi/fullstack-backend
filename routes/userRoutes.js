// backend/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authmiddleware");

// Get user details
router.get("/:id", authMiddleware, userController.getUserDetails);

// Update user details
router.put("/update/:id", authMiddleware, userController.updateUserDetails);

// Update user password
router.put("/password/:id", authMiddleware, userController.updateUserPassword);

module.exports = router;
