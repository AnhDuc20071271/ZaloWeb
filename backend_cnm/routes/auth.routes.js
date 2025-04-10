const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const multer = require("multer");

// Lưu file vào thư mục /uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});
const upload = multer({ storage });

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/reset-password", authController.resetPassword);
router.post("/update-profile", authController.updateProfile);
router.post("/upload-avatar", upload.single("avatar"), authController.uploadAvatar);
router.get("/user/:phone", authController.getUserByPhone);
router.get("/:phone", authController.getUserByPhone);
module.exports = router;
