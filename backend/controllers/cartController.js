const Cart = require('../models/cartModel');
const SellItem = require('../models/sellItemModel'); // Assuming this is your product model

const getCart = async (req, res) => {
  try {
    const userId = req.params.userId;

    const cart = await Cart.findOne({ userId, status: 'active' }).populate('items.itemId');

    if (!cart) {
      return res.status(200).json({ items: [], status: 'active', userId });
    } 

    res.status(200).json(cart);
  } catch (err) {
    console.error('Error fetching cart:', err);
    res.status(500).json({ message: 'Error fetching cart', error: err.message });
  }
};
 
// Add item to cart
exports.addToCart = async (req, res) => {
  const { userId, itemId, orderQuantity } = req.body;

  try {
    const product = await SellItem.findById(itemId);
    if (!product) return res.status(404).json({ message: 'Item not found' });

    const total = product.price * orderQuantity;

    let cart = await Cart.findOne({ userId, status: 'active' });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(item => item.itemId.equals(itemId));

    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].orderQuantity += orderQuantity;
      cart.items[existingItemIndex].total += total;
    } else {
      cart.items.push({
        itemId,
        name: product.name,
        imageUrl: product.imageUrl,
        price: product.price,
        orderQuantity,
        total
      });
    }

    await cart.save();
    res.json({ message: 'Item added to cart', cart });

  } catch (err) {
    res.status(500).json({ message: 'Error adding to cart', error: err.message });
  }
};

// Update quantity of item in cart
exports.updateItemQuantity = async (req, res) => {
  const { userId, itemId, orderQuantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId, status: 'active' });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find(item => item.itemId.equals(itemId));
    if (!item) return res.status(404).json({ message: 'Item not in cart' });

    item.orderQuantity = orderQuantity;
    item.total = item.price * orderQuantity;

    await cart.save();
    res.json({ message: 'Cart updated', cart });

  } catch (err) {
    res.status(500).json({ message: 'Error updating cart', error: err.message });
  }
};

// Remove item from cart
exports.removeItem = async (req, res) => {
  const { userId, itemId } = req.body;

  try {
    const cart = await Cart.findOne({ userId, status: 'active' });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => !item.itemId.equals(itemId));
    await cart.save();

    res.json({ message: 'Item removed', cart });
  } catch (err) {
    res.status(500).json({ message: 'Error removing item', error: err.message });
  }
};

// Clear the entire cart
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId, status: 'active' });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = [];
    await cart.save();

    res.json({ message: 'Cart cleared', cart });
  } catch (err) {
    res.status(500).json({ message: 'Error clearing cart', error: err.message });
  }
};

// Place order (mark cart as ordered)
exports.placeOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId, status: 'active' });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    // Validate stock and update item quantities
    for (const item of cart.items) {
      const product = await SellItem.findById(item.itemId);
      if (!product || product.quantity < item.orderQuantity) {
        return res.status(400).json({ message: `Not enough stock for ${item.name}` });
      }
      product.quantity -= item.orderQuantity;
      await product.save();
    }

    cart.status = 'ordered';
    await cart.save();

    res.json({ message: 'Order placed successfully', order: cart });
  } catch (err) {
    res.status(500).json({ message: 'Error placing order', error: err.message });
  }
};


exports.getCart = getCart;