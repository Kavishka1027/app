const express = require('express');
const router = express.Router();
const dietPlanController = require('../controllers/dietPlanController');

// POST new diet plan
router.post('/dietplan', dietPlanController.createDietPlan);

module.exports = router;
