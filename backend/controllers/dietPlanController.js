const DietPlan = require('../models/dietPlanModel');

// Create a diet plan
exports.createDietPlan = async (req, res) => {
    try {
        const { petType, weightKg, weightG, ageLevel, activityLevel } = req.body;

        const dailyCalories = calculateCalories(petType, weightKg, weightG, ageLevel, activityLevel);

        const dietPlan = await DietPlan.create({
            petType,
            weightKg,
            weightG,
            ageLevel,
            activityLevel,
            dailyCalories
        });

        res.status(201).json(dietPlan);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

