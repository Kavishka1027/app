const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sellItemSchema = new Schema({
    itemType: { type: String, required: true, enum: ["Food", "Toy", "Medicine"] },
    itemId: { type: String, required: true, unique: true },
    brand: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true,  enum: ['Dog', 'Cat']},
    quantity: { type: Number, required: true },
    expDate: { type: Date, required: false },
    manufactureDate: { type: Date, required: false },
    description: { type: String, required: false },
    price: { type: Number, required: true },
    image: { type: String, required: false },
    status: { type: String, enum: ["available", "sold"], default: "available" },
}, { timestamps: true });

module.exports = mongoose.model("sellItemModel", sellItemSchema);