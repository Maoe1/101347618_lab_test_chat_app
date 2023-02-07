
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    room: String,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: String,
    timestamp: Date
  });

  const Message = mongoose.model("Message", messageSchema);
  module.exports = Message;