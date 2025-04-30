const FoodItem = require('../models/foodItemsModel');

// Add a new food item

const addFoodItem = async (req, res) => {
  try {
    const {
      category,
      foodId,
      foodName,
      caloriesPer100g,
    } = req.body;

    // Validate required fields
    if (!category || !foodId || !foodName || !caloriesPer100g) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Prepare food item data
    const newFoodItem = new FoodItem({
      category,
      foodId,
      foodName,
      caloriesPer100g,
    });

    // Save to DB
    await newFoodItem.save();

    res.status(201).json({
      message: "Food item added successfully",
      foodItem: newFoodItem,
    });

  } catch (error) {
    console.error("Error in addFoodItem:", error);
    res.status(500).json({
      error: error.message,
    });
  }
};


// Get all food items
const getAllFoods = async (req, res, next) => {
  let foods;
  try {
    foods = await FoodItem.find();
  } catch (err) {
    console.log("Error fetching foods!", err);
  }
  
  if (!foods || foods.length === 0) {
    return res.status(404).json({ message: "No foods found" });
  }

  return res.status(200).json({ foods });
};

// Get all food items by category
const getAllFoodsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const foods = await FoodItem.find({ category });
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve foods by category', error: error.message });
  }
};


// Get a single food item by its ID
const getFoodByID = async (req, res) => {
  const id = req.params.id;

  let food;
  try {
    food = await FoodItem.findById(id);
  }catch (err) {
    console.log("Error fetching food:", err);
  }
  if (!food) {
    return res.status(404).json({ message: 'Food item not found' });
  }
  return res.status(200).json({ food });
};

const generateWeeklyDietPlan = async (req, res) => {
  try {
    const dailyCalories = parseFloat(req.query.dailyCalories);
    if (!dailyCalories || dailyCalories <= 0) {
      return res.status(400).json({ message: 'Invalid daily calorie amount' });
    }

    // Caloric distribution
    const calorieDistribution = {
      meat: dailyCalories * 0.5,
      vegetable: dailyCalories * 0.3,
      milk: dailyCalories * 0.1,
      fruit: dailyCalories * 0.1,
    };

    // Fetch all food items by category
    const allFoods = await FoodItem.find();
    const categorizedFoods = {
      meat: allFoods.filter(item => item.category === 'Meat'),
      vegetable: allFoods.filter(item => item.category === 'Vegetable'),
      milk: allFoods.filter(item => item.category === 'Milk'),
      fruit: allFoods.filter(item => item.category === 'Fruit'),
    };

    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const usedMeats = new Set();
    const dietPlan = [];

    for (let i = 0; i < 7; i++) {
      const day = weekdays[i];

      const pickRandom = (list, exclude = []) => {
        const filtered = list.filter(item => !exclude.includes(item.name));
        if (filtered.length === 0) return null;
        return filtered[Math.floor(Math.random() * filtered.length)];
      };

      // Meat - avoid duplicates on adjacent days
      const meat = pickRandom(categorizedFoods.meat, [...usedMeats]);
      usedMeats.add(meat.name);
      if (usedMeats.size > categorizedFoods.meat.length - 2) usedMeats.clear(); // reset if close to limit

      const vegetable = pickRandom(categorizedFoods.vegetable);
      const milk = pickRandom(categorizedFoods.milk);
      const fruit = pickRandom(categorizedFoods.fruit);

      const calculateWeight = (caloriesNeeded, per100gCal) => {
        return Math.round((caloriesNeeded / per100gCal) * 100); // in grams
      };

      const dayPlan = {
        day,
        items: [
          {
            category: 'Meat',
            name: meat.name,
            weightInGrams: calculateWeight(calorieDistribution.meat, meat.caloriesPer100g),
          },
          {
            category: 'Vegetable',
            name: vegetable.name,
            weightInGrams: calculateWeight(calorieDistribution.vegetable, vegetable.caloriesPer100g),
          },
          {
            category: 'Milk',
            name: milk.name,
            weightInGrams: calculateWeight(calorieDistribution.milk, milk.caloriesPer100g),
          },
          {
            category: 'Fruit',
            name: fruit.name,
            weightInGrams: calculateWeight(calorieDistribution.fruit, fruit.caloriesPer100g),
          },
        ],
      };

      dietPlan.push(dayPlan);
    }

    res.status(200).json({ dietPlan });

  } catch (err) {
    console.error('Error generating diet plan:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Update a food item
const updateFood = async (req, res) => {
    
    const { category, foodId, foodName, caloriesPer100g } = req.body;
    const updates = req.params.id;

    let foods;
    try {
      foods = await FoodItem.findByIdAndUpdate(updates,{
        caloriesPer100g: caloriesPer100g,
        foodName: foodName,
      });

      foods = await foods.save();
    } catch (err) {
      console.log("Error updating food:", err);
    }
    if (!foods) {
      return res.status(500).json({ message: 'Unable to update food data' });
    }
    return res.status(200).json({ foods });
  };


// Delete a food item
const deleteFood = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedFood = await FoodItem.findByIdAndDelete(id);

    if (!deletedFood) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    res.status(200).json({ message: 'Food item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete food item', error: error.message });
  }
};


exports.addFoodItem = addFoodItem;
exports.getAllFoods = getAllFoods;
exports.getAllFoodsByCategory = getAllFoodsByCategory;
exports.getFoodByID = getFoodByID;
exports.updateFood = updateFood;
exports.deleteFood = deleteFood;
exports.generateWeeklyDietPlan = generateWeeklyDietPlan;
