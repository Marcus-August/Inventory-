const mongoose = require( 'mongoose');

const inventorySchema = new 
mongoose. Schema ({
    itemName: String, 
    quantity: Number, 
    description: String,
});

const InventoryItem = 
mongoose.model ( 'InventoryItem', inventorySchema);

module. exports = InventoryItem;