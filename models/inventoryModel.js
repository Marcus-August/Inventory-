// models/inventoryModel.js
const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    size: { type: String },
    quantity: { type: Number, required: true, min: 0 },
    updatedAt: { type: Date, default: Date.now }
});

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;
