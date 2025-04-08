const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { updateAvatar } = require("../controllers/user.controller");

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

router.post("/update-avatar", upload.single("avatar"), updateAvatar);

module.exports = router;
