const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: "userModel", required: true },
  receiver: { type: Schema.Types.ObjectId, ref: "userModel", required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  seen: { type: Boolean, default: false },
});

module.exports = mongoose.model("messageModel", messageSchema);
