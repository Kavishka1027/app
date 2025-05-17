const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

router.post("/send", messageController.sendMessage);
router.get("/conversation/:user1/:user2", messageController.getConversation);
router.put("/seen", messageController.markMessagesAsSeen);

module.exports = router;
