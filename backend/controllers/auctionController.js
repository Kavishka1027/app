const Auction = require('../models/auctionModel');
const Pet = require('../models/petModel');
const User = require('../models/userModel'); // Assuming you have a user model

// Create a new auction
exports.createAuction = async (req, res) => {
  try {
    const { petId, startingPrice, durationDays } = req.body;

    const pet = await Pet.findById(petId);
    if (!pet) return res.status(404).json({ message: 'Pet not found' });

    const endTime = new Date();
    endTime.setDate(endTime.getDate() + parseInt(durationDays));

    const auction = await Auction.create({
      pet: petId,
      startingPrice,
      currentBid: startingPrice,
      endTime,
      status: 'active',
      bidders: []
    });

    res.status(201).json({ message: 'Auction created.', auction });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Get list of active auctions
exports.getActiveAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find({ status: 'active' }).populate('pet');
    res.status(200).json(auctions);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching auctions', error: err.message });
  }
};

// Place a bid
exports.placeBid = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const { userId, amount } = req.body;

    const auction = await Auction.findById(auctionId);
    if (!auction) return res.status(404).json({ message: 'Auction not found' });
    if (auction.status !== 'active') return res.status(400).json({ message: 'Auction is not active' });
    if (new Date() > auction.endTime) return res.status(400).json({ message: 'Auction has ended' });

    if (amount <= auction.currentBid) {
      return res.status(400).json({ message: 'Bid must be higher than current bid' });
    }

    auction.bidders.push({
      user: userId,
      amount,
      time: new Date()
    });

    auction.currentBid = amount;
    auction.currentBidder = userId;

    await auction.save();

    res.status(200).json({ message: 'Bid placed successfully', auction });
  } catch (err) {
    res.status(500).json({ message: 'Error placing bid', error: err.message });
  }
};

// End all expired auctions (can be run on a schedule)
exports.endExpiredAuctions = async (req, res) => {
  try {
    const now = new Date();
    const expiredAuctions = await Auction.find({ status: 'active', endTime: { $lt: now } });

    for (let auction of expiredAuctions) {
      auction.status = 'completed';
      await auction.save();
    }

    res.status(200).json({ message: 'Expired auctions ended successfully', count: expiredAuctions.length });
  } catch (err) {
    res.status(500).json({ message: 'Error ending auctions', error: err.message });
  }
};

// Get list of completed auctions with winners
exports.getWinners = async (req, res) => {
  try {
    const completedAuctions = await Auction.find({ status: 'completed' })
      .populate('pet')
      .populate('currentBidder', 'name email');

    const result = completedAuctions.map(auction => ({
      pet: auction.pet?.name || 'Unknown',
      finalBid: auction.currentBid,
      winner: auction.currentBidder ? {
        name: auction.currentBidder.name,
        email: auction.currentBidder.email
      } : 'No bids placed'
    }));

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching winners', error: err.message });
  }
};



