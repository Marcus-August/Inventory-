const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    category: {
        type: String,
        enum: [
            'bottoms',
            'pants',
            'tops',
            'flight suits',
            'ocp uniforms',
            'pt uniforms',
            'blue uniforms',
            'det patch',
            'air force tape',
            'ribbons',
            'shorts',
            'undershirts',
            'blouse',
            'belt',
            'boots',
            'cover',
            'socks',
            'shoes',
            'jacket',
            'shirt',
            'jackets',
            'fleece jacket',
            'flight suit',
            'caps'

        ],
        required: true
    },
    size: {
        type: String,
        enum: ['xs', 's', 'm', 'l', 'xl', 'small', 'large', 'medium', 'extra large'], // Include sizes you need
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Stock', stockSchema);