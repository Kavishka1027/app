const express = require('express');
const router = express.Router();

const foodItemModel = require('../models/foodItemsModel'); 
const foodItemController = require('../controllers/foodItemsController');


router.post('/addFoodItem', foodItemController.addFoodItem);
router.get('/', foodItemController.getAllFoods);
router.get('/:id', foodItemController.getFoodByID);
router.put('/:id', foodItemController.updateFood);
router.get('/dietPlan', foodItemController.generateWeeklyDietPlan);

module.exports = router;