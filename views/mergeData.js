const mongoose = require('mongoose');

// Define the schema
const personnelSchema = new mongoose.Schema({
    name: String,
    quantity: Number,
    category: {
        type: String,
        enum: ['Flight Suits', 'OCP Uniforms', 'PT Uniforms', 'Cadets Names', 'Catch All']
    },
    pantsSize: String,
    shortSize: String,
    shirtSize: String,
    rank: String
});

// Create the model
const Personnel = mongoose.model('Personnel', personnelSchema);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myDatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(async () => {
    console.log('Connected to MongoDB');

    // Merge data from 'uniforms' to 'personnels'
    const uniforms = await mongoose.connection.db.collection('uniforms').find({}).toArray();
    for (const uniform of uniforms) {
        await Personnel.updateOne(
            { _id: uniform._id },
            {
                $set: {
                    name: uniform.name,
                    quantity: uniform.quantity || 1,  // Default quantity if not present
                    category: uniform.category,
                    pantsSize: uniform.pantsSize,
                    shortSize: uniform.shortSize,
                    shirtSize: uniform.shirtSize,
                    rank: uniform.rank
                }
            },
            { upsert: true }
        );
    }
    console.log('Data merged successfully');

    // Close the connection
    mongoose.connection.close();
})
.catch(err => console.error('Error connecting to MongoDB:', err));

