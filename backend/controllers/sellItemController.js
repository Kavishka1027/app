const sellItemModel = require('../models/sellItemModel');
const petModel = require('../models/petModel');


// View All selling items {for Admin Use}
const getAllSellItems = async (req, res) => {
    try {
        const sellItems = await sellItemModel.find();

        if (!sellItems.length ) {
            return res.status(200).json({ message: "No selling items found" });
        }

        return res.status(200).json({ sellItems });
    } catch (error) {
        console.error("Error fetching selling items:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}; 

// Create a new selling item {for Admin Use}
const createSellItem = async (req, res) => {
    try {
        const { itemType, itemId, brand, name, category, quantity, expDate, manufactureDate, description, price, image, status } = req.body;

        const newSellItem = new sellItemModel({
            itemType,
            itemId,
            brand,
            name,
            category,
            quantity,
            expDate,
            manufactureDate,
            description,
            price,
            image,
            status
        });

        await newSellItem.save();
        return res.status(201).json({ message: "Selling item created successfully", newSellItem });
    } catch (error) {
        console.error("Error creating selling item:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Stock Management {for Admin Use}

// view available items by type (Food, Toy, Medicine)
const getAvailableItemsByType = async (req, res) => {
    const type = req.params.type || req.query.type;   // add query parameter for future implementation

    const validTypes = ["Food", "Toy", "Medicine"];
    if (!validTypes.includes(type)) {
        return res.status(400).json({ message: "Invalid item type" });
    }

    try {
        const availableItems = await sellItemModel.find({ itemType: type, status: "available" });
        return res.status(200).json({ availableItems });
    } catch (error) {
        console.error(`Error fetching available ${type} items:`, error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

//view available Dogs
const getAvailableDogs = async (req, res) => {
    try {
        const availableDogs = await petModel.find({ status: "available" });
        return res.status(200).json({ availableDogs });
    } catch (error) {
        console.error("Error fetching available dogs:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};




exports.getAllSellItems = getAllSellItems;
exports.createSellItem = createSellItem;

//for user
exports.getAvailableItemsByType = getAvailableItemsByType;
exports.getAvailableDogs = getAvailableDogs;