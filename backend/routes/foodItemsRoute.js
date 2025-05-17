const express = require('express');
const router = express.Router();

const foodItemModel = require('../models/foodItemsModel'); 
const foodItemController = require('../controllers/foodItemsController');


router.post('/addFoodItem', foodItemController.addFoodItem);
router.get('/foods', foodItemController.getAllFoods);
router.get('/:id', foodItemController.getFoodByID);
router.put('/:id', foodItemController.updateFood);
router.get('/dietPlan', foodItemController.generateWeeklyDietPlan);
router.get('/random', foodItemController.getRandomFoods);

module.exports = router;