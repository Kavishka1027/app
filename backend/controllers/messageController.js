const Message = require("../models/messageModel");

// Send message
const sendMessage = async (req, res) => {
  const { senderId, receiverId, content } = req.body;
  try {
    const message = new Message({ sender: senderId, receiver: receiverId, content });
    await message.save();
    return res.status(201).json({ message: "Message sent", data: message });
  } catch (err) {
    return res.status(500).json({ error: "Failed to send message", detail: err.message });
  }
};

// Get conversation between two users
const getConversation = async (req, res) => {
  const { user1, user2 } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
    }).sort({ timestamp: 1 });
    return res.status(200).json(messages);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch messages" });
  }
};

// Mark all messages from sender to receiver as seen
const markMessagesAsSeen = async (req, res) => {
  const { senderId, receiverId } = req.body;
  try {
    await Message.updateMany(
      { sender: senderId, receiver: receiverId, seen: false },
      { seen: true }
    );
    return res.status(200).json({ message: "Messages marked as seen" });
  } catch (err) {
    return res.status(500).json({ error: "Failed to update seen status" });
  }
};


exports.sendMessage = sendMessage;
exports.getConversation = getConversation;
exports.markMessagesAsSeen = markMessagesAsSeen;
