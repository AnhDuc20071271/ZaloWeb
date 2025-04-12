const express = require("express");
const router = express.Router();
const { getUsersByPhones } = require("../controllers/users.controller");

router.post("/batch-info", getUsersByPhones);

module.exports = router;
