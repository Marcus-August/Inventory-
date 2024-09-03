const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Personnel = require('./models/Personnel');
const inventoryRoutes = require('./routes/inventoryRoutes');
const helmet = require('helmet');
const crypto = require('crypto');
const Stock = require('./models/stock'); // Import the new model

// Initialize Express app
const app = express();

// Middleware to generate nonce and set CSP header
app.use((req, res, next) => {
    res.locals.cspNonce = crypto.randomBytes(16).toString('base64');
    res.setHeader(
      'Content-Security-Policy',
      `default-src 'self'; style-src 'self' 'nonce-${res.locals.cspNonce}'; script-src 'self' 'nonce-${res.locals.cspNonce}'`
    );
    next();
  });
  
  // Use helmet for other security settings
  app.use(helmet());
  
  // Your routes and other middleware here
  app.get('/', (req, res) => {
    res.render('index', { title: 'Home', cspNonce: res.locals.cspNonce });
  });

// Import and use your routes
const inventoryRouter = require('./routes/inventoryRoutes');
app.use('/inventory', inventoryRouter);

// Get MongoDB URI from environment variables
const uri = process.env.MONGODB_URI;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Connected to MongoDB Atlas');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB Atlas:', err);
    });
    
// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self'; font-src 'self' http://localhost:3001;");
    next();
});
// Middleware for form parsing
app.use(express.urlencoded({ extended: true }));

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Example route
app.get('/', (req, res) => {
    const items = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' },
    ];
    res.render('index', { title: 'ROTC Inventory Management System', items });
});

// Route to render query form
app.get('/personnel/query', (req, res) => {
    res.render('query', { title: 'Query Personnel' });
});

// Use inventoryRoutes for all routes starting with /inventory
app.use('/inventory', inventoryRoutes);

// Handle delete requests (for example purposes, you can handle actual deletion logic)
app.post('/delete-item/:id', (req, res) => {
    const itemId = req.params.id;
    console.log(`Item to delete: ${itemId}`);
    // Add your deletion logic here
    res.redirect('/');
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error('An error occurred:', err);
    res.status(500).send('Internal Server Error');
});

// Function to insert document into MongoDB
async function insertDocument(data) {
    try {
        const newPersonnel = new Personnel(data);
        await newPersonnel.save();
        console.log("Document inserted:", newPersonnel);
    } catch (error) {
        console.error("MongoDB Error:", error);
    }
}

// Route to handle POST request for adding personnel for PT Uniforms
app.post('/pt-uniforms/add', async (req, res) => {
    try {
        const { name, size, quantity, category } = req.body;

        if (!name || !size || !quantity || !category) {
            return res.status(400).send('All fields are required');
        }

        const validCategories = ['pt shorts', 'pt shirt', 'pt pants', 'pt jacket'];
        if (!validCategories.includes(category)) {
            return res.status(400).send('Invalid category');
        }

        const newItem = new Personnel({
            name,
            size,
            quantity: parseInt(quantity, 10),
            category
        });

        const savedItem = await newItem.save();
        console.log('Document inserted:', savedItem);
        res.redirect('/pt-uniforms');
    } catch (error) {
        console.error('Error handling POST request:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/pt-uniforms', async (req, res) => {
    try {
        const ptUniforms = await Personnel.find({ category: { $in: ['pt shorts', 'pt shirt', 'pt pants', 'pt jacket'] } }).exec();
        console.log('Fetched PT Uniforms:', ptUniforms);
        res.render('pt-uniforms', { title: 'PT Uniforms', ptUniforms });
    } catch (error) {
        console.error('Error fetching PT Uniforms:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/pt-uniforms/delete/:id', async (req, res) => {
    try {
        const itemId = req.params.id;
        // Find and delete the PT Uniform item by its ID
        await Personnel.findByIdAndDelete(itemId);
        // Redirect back to the PT Uniforms page after deletion
        res.redirect('/pt-uniforms');
    } catch (error) {
        console.error('Error deleting PT Uniform item:', error);
        res.status(500).send('Internal Server Error');
    }
});




// Add POST Route for adding new personnel for OCP Uniforms
app.post('/inventory/ocp/add', async (req, res) => {
    try {
        const { name, size, quantity, category, ranks } = req.body;

        // Validate input
        if (!name || !size || !quantity || !category || !ranks) {
            return res.status(400).send('All fields are required');
        }

        // Define valid categories (you can adjust this based on your needs)
        const validCategories = [
            'ocp bottoms', 'ocp tops', 'ocp belt', 'ocp fleece jacket', 'ocp undershirts', 
            'ocp socks', 'ocp cover', 'ocp blouse', 'ocp boots', 'ocp det patch', 'ocp air force tape'
        ];
        if (!validCategories.includes(category)) {
            return res.status(400).send('Invalid category');
        }

        // Create a new Personnel document
        const newItem = new Personnel({
            name,
            size,
            quantity: parseInt(quantity, 10),
            category,
            ranks
        });

        // Save the document to the database
        await newItem.save();
        console.log('Document inserted:', newItem);

        // Redirect to the OCP page
        res.redirect('/inventory/ocp');
    } catch (error) {
        console.error('Error handling POST request:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Route handler to render the OCP Uniforms page
app.get('/inventory/ocp', async (req, res) => {
    try {
        // Fetch all personnel with categories related to OCP uniforms, including 'bottoms'
        const ocpPersonnel = await Personnel.find({ category: { $in: [
            'ocp bottoms', 'ocp tops', 'ocp belt', 'ocp fleece jacket', 'ocp undershirts', 
            'ocp socks', 'ocp cover', 'ocp blouse', 'ocp boots', 'ocp det patch', 'ocp air force tape'
        ] } });

        console.log('Filtered OCP Personnel:', ocpPersonnel);

        // Render the page with the fetched personnel
        res.render('ocp', { title: 'OCP Uniforms', ocpPersonnel });
    } catch (error) {
        console.error('Error fetching OCP data:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/inventory/ocp/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the personnel item by ID
        const result = await Personnel.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).send('Document not found');
        }

        console.log('Document deleted:', result);
        res.redirect('/inventory/ocp');
    } catch (error) {
        console.error('Error handling DELETE request:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Add POST Route for adding new personnel for Flight Suits
app.post('/flight/add', function (req, res) {
    const { name, quantity, category, size } = req.body;
    if (!name || !quantity || !category || !size) {
        return res.status(400).send('All fields are required');
    }
    insertDocument({
        name,
        quantity: parseInt(quantity, 10),
        category,
        size
    });
    res.redirect('/flight-suits');
});

// Flight Suits Route
app.get('/flight-suits', async (req, res) => {
    try {
        const flightSuitsPersonnel = await Personnel.find({ category: { $in: ['flight suit', 'caps'] } });
        console.log('Filtered Flight Suits Personnel:', flightSuitsPersonnel); // Log filtered documents
        res.render('flight-suits', { title: 'Flight Suits', flightSuitsPersonnel });
    } catch (error) {
        console.error('Error fetching Flight Suits data:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.post('/inventory/flight-suits/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Personnel.findByIdAndDelete(id);
        res.redirect('/flight-suits'); // Redirect back to the flight suits page after deletion
    } catch (error) {
        console.error('Error deleting flight suit:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Add Item Route
app.post('/add', (req, res) => {
    const { name, quantity } = req.body;
    const newPersonnel = new Personnel({
        name,
        quantity: parseInt(quantity, 10)
    });
    newPersonnel.save()
        .then(() => {
            res.redirect('/');
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send('Server Error');
        });
});

// Route handler for Blues Uniforms
app.get('/blues', async (req, res) => {
    try {
        // Fetch items based on their category
        const bluesPersonnel = await Personnel.find({ category: { $in: ['blue pants', 'blue tops', 'blue jackets', 'blue belt', 'blue cover', 'blue socks', 'blue shoes'] } });
        res.render('blues', { title: 'Blue Uniforms', bluesPersonnel });
    } catch (error) {
        console.error('Error fetching Blue Uniforms data:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/inventory/blues/add', async (req, res) => {
    try {
        const { name, size, quantity, category, ranks, ribbons } = req.body;

        if (!name || !size || !quantity || !category || !ranks || !ribbons) {
            return res.status(400).send('All fields are required');
        }

        const validCategories = ['blue pants', 'blue tops', 'blue jackets', 'blue belt', 'blue cover', 'blue socks', 'blue shoes'];
        if (!validCategories.includes(category)) {
            return res.status(400).send('Invalid category');
        }

        const newItem = new Personnel({
            name,
            size,
            quantity: parseInt(quantity, 10),
            category, // Use the selected category
            ranks,
            ribbons
        });

        const savedItem = await newItem.save();
        console.log('Document inserted:', savedItem);

        res.redirect('/blues');
    } catch (error) {
        console.error('Error handling POST request:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.post('/inventory/blues/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Personnel.findByIdAndDelete(id);
        
        if (result) {
            console.log('Document deleted:', result);
            res.redirect('/blues');
        } else {
            res.status(404).send('Document not found');
        }
    } catch (error) {
        console.error('Error deleting document:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route handler for PT Uniforms
app.get('/pt-uniforms', async function (req, res) {
    try {
        const personnel = await Personnel.find({ category: 'PT Uniforms' });
        res.render('pt-uniforms', { title: 'PT Uniforms', personnel });
    } catch (error) {
        console.error('Error fetching PT uniforms data:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Cadets Route
app.get('/cadets', async function (req, res) {
    try {
        const cadetsPersonnel = await Personnel.find({ category: 'Cadets Names' });
        res.render('cadets', { title: 'Cadets Names', cadetsPersonnel });
    } catch (error) {
        console.error('Error fetching Cadets Names data:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/stock', async (req, res) => {
    try {
      // Fetch all items from the database
      const blueUniforms = await Stock.find({ category: 'blue uniforms' });
      const ocpUniforms = await Stock.find({ category: 'ocp uniforms' });
      const flightSuits = await Stock.find({ category: 'flight suits' });
      const ptUniforms = await Stock.find({ category: 'pt uniforms' });
  
      res.render('stock', {
        blueUniforms,
        ocpUniforms,
        flightSuits,
        ptUniforms
      });
    } catch (err) {
      console.error('Error fetching stock items:', err);
      res.status(500).send('Error fetching stock items');
    }
  });
  
  // Route to handle adding new stock items
  app.post('/stock/add', async (req, res) => {
    try {
      const { name, quantity, category, size } = req.body;
  
      // Create a new stock item
      const newItem = new Stock({ name, quantity, category, size });
      await newItem.save();
  
      // Redirect back to the stock page
      res.redirect('/stock');
    } catch (err) {
      console.error('Error adding stock item:', err);
      res.status(500).send('Error adding stock item');
    }
  });
  
  // Update stock item
  app.post('/stock/:category/update/:id', async (req, res) => {
    const { category, id } = req.params;
    const { quantity } = req.body;
    try {
      await Stock.findByIdAndUpdate(id, { quantity });
      res.redirect('/stock');
    } catch (err) {
      console.error('Error updating stock item:', err);
      res.status(500).send('Error updating stock item');
    }
  });

// Delete stock item
app.post('/stock/:category/delete/:id', async (req, res) => {
    const { category, id } = req.params;
    try {
      await Stock.findByIdAndDelete(id);
      res.redirect('/stock');
    } catch (err) {
      console.error('Error deleting stock item:', err);
      res.status(500).send('Error deleting stock item');
    }
  });

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
