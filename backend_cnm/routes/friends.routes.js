const express = require("express");
const router = express.Router();
const friendController = require("../controllers/friends.controller");


router.post("/request", friendController.sendFriendRequest);        // Gửi lời mời kết bạn
router.get("/request/sent/:phone", friendController.getSentRequests); // Danh sách đã gửi
router.get("/request/received/:phone", friendController.getReceivedRequests); // Danh sách đã nhận
router.post("/request/accept", friendController.acceptFriendRequest);
router.post("/request/reject", friendController.rejectFriendRequest);
router.post("/request/cancel", friendController.cancelFriendRequest);
router.post("/cancel", friendController.cancelFriendRequest);
router.get("/list/:phone", friendController.getFriendsList);       // Danh sách bạn bè
router.post("/accept", friendController.acceptFriendRequest);
router.post("/reject", friendController.rejectFriendRequest);
router.post("/cancel", friendController.cancelFriendRequest);
module.exports = router;
