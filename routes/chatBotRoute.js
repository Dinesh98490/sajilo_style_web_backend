const express = require("express");
const router = express.Router();
const handleChatQuery = require("../controllers/chatbotcontroller");

// POST /api/chatbot
// router.post("/", handleChatQuery);

router.post("/chat", handleChatQuery);

module.exports = router;
