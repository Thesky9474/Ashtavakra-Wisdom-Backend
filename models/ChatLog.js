const mongoose = require('mongoose');

const ChatLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  prompt: String,
  response: String,
  matchedVerses: [Object],
}, { timestamps: true });

module.exports = mongoose.model('ChatLog', ChatLogSchema);
