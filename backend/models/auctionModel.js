const mongoose = require('mongoose');
const shortid = require('shortid');

const bidSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  time: { type: Date, default: Date.now },
});

const auctionSchema = new mongoose.Schema({
  auctionId: { type: String, default: shortid.generate, unique: true },
  pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet' },
  startingPrice: Number,
  currentBid: Number,
  currentBidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  endTime: Date,
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
  bidders: [bidSchema],
});

module.exports = mongoose.model('Auction', auctionSchema);