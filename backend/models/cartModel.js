const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartItemSchema = new Schema({
  itemId: {
    type: Schema.Types.ObjectId,
    ref: 'SellItem',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  imageUrl: String,
  price: {
    type: Number,
    required: true
  },
  orderQuantity: {
    type: Number,
    required: true,
    min: 1
  },
  total: {
    type: Number,
    required: true
  }
});

const CartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [CartItemSchema],
  status: {
    type: String,
    enum: ['active', 'ordered', 'cancelled'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('cartModel', CartSchema);
