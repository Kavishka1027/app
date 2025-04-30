const mongoose = require('mongoose');

const dietPlanSchema = new mongoose.Schema({
    petType: {
        type: String,
        required: true,
        enum: ['dog', 'cat']
    },
    weightKg: {
        type: Number,
        required: true,
    },
    weightG: {
        type: Number,
        required: true,
    },
    ageLevel: {
        type: String,
        required: true,
        enum: ['puppy', 'adult', 'senior', 'kitten']
    },
    activityLevel: {
        type: String,
        required: true,
        enum: ['low', 'normal', 'high']
    },
    dailyCalories: {
        type: Number,
        required: true,
    }
}, { timestamps: true });

const DietPlan = mongoose.model('DietPlan', dietPlanSchema);

module.exports = DietPlan;

