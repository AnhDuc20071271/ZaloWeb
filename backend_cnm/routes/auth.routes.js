// File: routes/auth.route.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { resetPassword } = require("../controllers/auth.controller");

router.post("/reset-password", resetPassword);
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);

module.exports = router;
