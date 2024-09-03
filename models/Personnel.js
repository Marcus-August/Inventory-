const mongoose = require('mongoose');

const personnelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    category: {
        type: String,
        enum: [
            'flight suits',
        'ocp uniforms',
        'pt uniforms',
        'cadets names',
        'blue uniforms',
        'ocp bottoms',
        'pants',
        'pt shorts',
        'pt shirt',
        'pt pants',
        'pt jacket',
        'blue belt',
        'blue tops',
        'ocp det patch',
        'ocp air force tape',
        'ribbons',
        'shorts',
        'ocp undershirts',
        'ocp blouse',
        'ocp belt',
        'ocp boots',
        'ocp cover',
        'ocp tops',
        'ocp socks',
        'blue shoes',
        'blue pants',
        'blue socks',
        'blue cover',
        'jacket',
        'shirt',
        'blue jackets',
        'fleece jacket',
        'flight suit',
        'caps',
        'accessories'
        ],
        required: true
    },
    size: { 
        type: String, 
        enum: ['xs', 's', 'm', 'l', 'xl','small', 'medium', 'large', 'extra large'] // Valid sizes
    },
    beltSize: String,  // Example field for belt size
    ranks: String,  // Added field for ranks
    ribbons: Number, // Added field for ribbons if applicable
}, { timestamps: true }); // Adds createdAt and updatedAt fields

module.exports = mongoose.model('Personnel', personnelSchema);