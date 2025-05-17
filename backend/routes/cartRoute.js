const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/:userId', cartController.getCart);
router.post('/add', cartController.addToCart);
router.put('/update', cartController.updateItemQuantity);
router.delete('/remove', cartController.removeItem);
router.delete('/clear/:userId', cartController.clearCart);
router.post('/place-order/:userId', cartController.placeOrder);

module.exports = router;
