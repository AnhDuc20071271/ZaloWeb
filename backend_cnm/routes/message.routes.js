const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const messageController = require("../controllers/message.controller");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "..", "uploads", "files")); // 🛠 đúng đường
    },
    filename: function (req, file, cb) {
      const uniqueName = Date.now() + "-" + Math.floor(Math.random() * 100000) + path.extname(file.originalname);
      cb(null, uniqueName);
    },
  });
  
  const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  });
 // Các route khác 
router.post("/send-file", upload.single("file"), messageController.sendFile);
router.post("/recall", messageController.recallMessage);
router.post("/send", messageController.sendMessage);
router.get("/", messageController.getMessages);

module.exports = router;
