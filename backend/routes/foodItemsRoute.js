const express = require('express');
const router = express.Router();

const foodItemController = require('../controllers/foodItemsController');

// Routes
router.post('/add', foodItemController.addFoodItem);                  // Add a new food item
router.get('/all', foodItemController.getAllFoods);                   // Get all food items
router.get('/category/:category', foodItemController.getAllFoodsByCategory); // Get by category
router.get('/dietPlan', foodItemController.generateWeeklyDietPlan);   // Generate diet plan
router.get('/:id', foodItemController.getFoodByID);                   // Get single item
router.put('/:id', foodItemController.updateFood);                    // Update food item
router.delete('/:id', foodItemController.deleteFood);                 // Delete food item

module.exports = router;
