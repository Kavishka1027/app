const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['Meat', 'Vegetables', 'Milk', 'Fruits'],
  },
  foodId: {
    type: String,
    required: true,
  },
  foodName: {
    type: String,
    required: true,
  },
  caloriesPer100g: {
    type: Number,
    required: true,
  }
});

module.exports = mongoose.model('FoodItem', foodItemSchema);