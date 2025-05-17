const express = require('express');
const router = express.Router();
const auctionController = require('../controllers/auctionController');

// Make sure all these controller functions exist and are exported correctly
router.post('/create', auctionController.createAuction);
router.get('/active', auctionController.getActiveAuctions);
router.post('/bid/:auctionId', auctionController.placeBid);
router.get('/end-expired', auctionController.endExpiredAuctions); // If used manually
router.get('/winners', auctionController.getWinners);

module.exports = router;
