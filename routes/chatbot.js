const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { askGemini, getChatHistory } = require('../controllers/chatbotController');

router.post('/ask-gemini', authMiddleware, askGemini);
router.get('/history', authMiddleware, getChatHistory);

module.exports = router;
