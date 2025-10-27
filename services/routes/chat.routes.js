const express = require("express");
const { getMessages, getConversations } = require("../controlers/messages.controler");
const authenticateToken = require("../middleware/authenticateToken");
const router = express.Router();

router.get("/messages", authenticateToken, getMessages);
router.get("/conversations", authenticateToken, getConversations);
module.exports = router;    