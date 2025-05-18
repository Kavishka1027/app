const FoodItem = require('../models/foodItemsModel');

// Add a new food item
const addFoodItem = async (req, res) => {
  try {
    const { category, foodId, foodName, caloriesPer100g } = req.body;

    if (!category || !foodId || !foodName || caloriesPer100g == null) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingFood = await FoodItem.findOne({ foodId });
    if (existingFood) {
      return res.status(409).json({ error: "Food item with this ID already exists" });
    }

    const newFoodItem = new FoodItem({ category, foodId, foodName, caloriesPer100g });
    await newFoodItem.save();

    res.status(201).json({
      message: "Food item added successfully",
      foodItem: newFoodItem,
    });

  } catch (error) {
    console.error("Error in addFoodItem:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all food items
const getAllFoods = async (req, res) => {
  try {
    const foods = await FoodItem.find();
    if (!foods || foods.length === 0) {
      return res.status(404).json({ message: "No foods found" });
    }
    res.status(200).json({ foods });
  } catch (err) {
    console.error("Error fetching foods:", err);
    res.status(500).json({ error: "Failed to retrieve foods" });
  }
};

// Get all food items by category
const getAllFoodsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const foods = await FoodItem.find({ category });

    if (!foods || foods.length === 0) {
      return res.status(404).json({ message: "No food items found for this category" });
    }

    res.status(200).json({ foods });
  } catch (error) {
    console.error("Error fetching foods by category:", error);
    res.status(500).json({ error: "Failed to retrieve foods by category" });
  }
};

// Get a single food item by its ID
const getFoodByID = async (req, res) => {
  try {
    const id = req.params.id;
    const food = await FoodItem.findById(id);

    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    res.status(200).json({ food });
  } catch (err) {
    console.error("Error fetching food:", err);
    res.status(500).json({ error: "Failed to fetch food item" });
  }
};

// Generate weekly diet plan
const generateWeeklyDietPlan = async (req, res) => {
  const { dailyCalories } = req.query;

  if (!dailyCalories) {
    return res.status(400).json({ message: 'dailyCalories is required' });
  }

  try {
    const allItems = await FoodItem.find();

    // Group by category
    const categorized = {
      Meat: [],
      Vegetables: [],
      Milk: [],
      Fruits: [],
    };

    allItems.forEach(item => {
      if (categorized[item.category]) {
        categorized[item.category].push(item);
      }
    });

    // Require at least 1 item per category
    for (const cat of ['Meat', 'Vegetables', 'Milk', 'Fruits']) {
      if (categorized[cat].length === 0) {
        return res.status(400).json({ message: `Not enough items in category: ${cat}` });
      }
    }

    const dailyPortion = dailyCalories / 4; // 4 categories
    const plan = [];

    const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    for (let i = 0; i < 7; i++) {
      const dayPlan = [];

      for (const cat of ['Meat', 'Vegetables', 'Milk', 'Fruits']) {
        const item = getRandomItem(categorized[cat]);
        const weight = Math.round((dailyPortion / item.caloriesPer100g) * 100); // grams
        dayPlan.push({
          category: cat,
          name: item.foodName,
          caloriesPer100g: item.caloriesPer100g,
          weightInGrams: weight
        });
      }

      plan.push({
        day: days[i],
        items: dayPlan
      });
    }

    return res.status(200).json({ dietPlan: plan });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error generating diet plan' });
  }
};


// Update a food item
const updateFood = async (req, res) => {
  try {
    const { category, foodId, foodName, caloriesPer100g } = req.body;
    const id = req.params.id;

    const updatedFood = await FoodItem.findByIdAndUpdate(
      id,
      { category, foodId, foodName, caloriesPer100g },
      { new: true }
    );

    if (!updatedFood) {
      return res.status(404).json({ message: 'Food item not found for update' });
    }

    return res.status(200).json({ updatedFood });
  } catch (err) {
    console.error("Error updating food:", err);
    res.status(500).json({ error: "Failed to update food item" });
  }
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
    console.error("Error deleting food:", error);
    res.status(500).json({ error: 'Failed to delete food item' });
  }
};

// Export all controller methods
module.exports = {
  addFoodItem,
  getAllFoods,
  getAllFoodsByCategory,
  getFoodByID,
  updateFood,
  deleteFood,
  generateWeeklyDietPlan,
};
