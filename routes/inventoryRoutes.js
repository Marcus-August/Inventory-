const express = require('express');
const router = express.Router();
const Personnel = require('../models/Personnel'); // Adjust the path as necessary
const Inventory = require('../models/inventoryModel');

// Route to handle POST request for deleting personnel by ID
router.post('/delete/:id', async (req, res) => {
    const personnelId = req.params.id;

    try {
        const deletedPersonnel = await Personnel.findByIdAndDelete(personnelId);

        if (!deletedPersonnel) {
            return res.status(404).send('Personnel not found');
        }

        res.status(201).send('Personnel deleted successfully');
    } catch (error) {
        console.error('Error deleting personnel:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to handle POST request for adding personnel for Blues Uniforms
router.post('/inventory/blues/add', async (req, res) => {
    try {
        const { name, quantity, category, size, ranks, ribbons } = req.body;
        const newPersonnel = new Personnel({ name, quantity, category, size, ranks, ribbons });
        await newPersonnel.save();
        res.redirect('/inventory/blues');
    } catch (err) {
        console.error('Error adding personnel:', err);
        res.status(500).send('Internal Server Error');
    }
});


// Route to render Blues Uniforms inventory page
router.get('/inventory/blues', async (req, res) => {
    try {
        const bluesPersonnel = await Personnel.find({ category: 'Blue Uniforms' });
        res.render('blues', { title: 'Blue Uniforms', bluesPersonnel });
    } catch (error) {
        console.error('Error fetching Blues uniforms data:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to handle POST request for deleting personnel by ID (for Blues)
router.post('/inventory/blues/delete/:id', async (req, res) => {
    const personnelId = req.params.id;

    try {
        const deletedPersonnel = await Personnel.findByIdAndDelete(personnelId);

        if (!deletedPersonnel) {
            return res.status(404).send('Personnel not found');
        }

        res.redirect('/inventory/blues');
    } catch (error) {
        console.error('Error deleting Blues personnel:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Route to handle POST request for adding personnel for OCP Uniforms
router.post('/inventory/ocp/add', async (req, res) => {
    const { name, category, size, quantity, ranks } = req.body;

    if (!name || !category || !size || !quantity || !ranks) {
        return res.status(400).send('All fields are required');
    }

    try {
        const newPersonnel = new Personnel({
            name,
            category,
            size,
            quantity: parseInt(quantity, 10),
            ranks
        });
        await newPersonnel.save();
        res.redirect('/inventory/ocp');
    } catch (error) {
        console.error('Error adding OCP personnel:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to render OCP Uniforms inventory page
router.get('/inventory/ocp', async (req, res) => {
    try {
      const items = await Personnel.find({ category: 'OCP Uniforms' });
      res.render('ocpList', { items }); // Render the `ocpList.pug` template with the retrieved items
    } catch (error) {
      console.error('Error fetching items:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Route to handle POST request for adding personnel for Flight Suits
router.get('/flight-suits', async (req, res) => {
    try {
        const flightSuitsPersonnel = await Personnel.find({ category: 'Flight Suits' });
        res.render('flight-suits', { title: 'Flight Suits Inventory', flightSuitsPersonnel });
    } catch (error) {
        console.error('Error fetching Flight Suits data:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to handle adding new Flight Suits
router.post('/flight/add', async (req, res) => {
    try {
        const { name, size, quantity, category } = req.body;
        const newPersonnel = new Personnel({
            name,
            size,
            quantity,
            category
        });
        await newPersonnel.save();
        res.redirect('/flight-suits');
    } catch (error) {
        console.error('Error adding Flight Suit:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to handle deleting Flight Suits
router.post('/flight/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Personnel.findByIdAndDelete(id);
        res.redirect('/flight-suits');
    } catch (error) {
        console.error('Error deleting Flight Suit:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to handle POST request for adding personnel for PT Uniforms
router.post('/inventory/pt-uniforms/add', async (req, res) => {
    try {
        const { name, pantsSize, shortSize, shirtSize, quantity } = req.body;
        console.log('Request body:', req.body);

        if (!name || !pantsSize || !shortSize || !shirtSize || !quantity) {
            console.log('Missing fields');
            return res.status(400).send('All fields are required');
        }

        const newPersonnel = new Personnel({
            name,
            pantsSize,
            shortSize,
            shirtSize,
            quantity,
            category: 'PT Uniforms'
        });

        await newPersonnel.save();
        console.log('New personnel added:', newPersonnel);
        res.redirect('/pt-uniforms');
    } catch (error) {
        console.error('Error adding personnel:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Route to handle POST request for adding personnel for Cadets Names
router.post('/cadets/add', async (req, res) => {
    try {
        const { name, pantsSize, shortSize, shirtSize, rank, quantity } = req.body;
        const newPersonnel = new Personnel({
            name,
            pantsSize,
            shortSize,
            shirtSize,
            rank,
            quantity,
            category: 'Cadets Names'
        });
        await newPersonnel.save();
        res.redirect('/cadets');
    } catch (error) {
        console.error('Error adding personnel:', error);
        res.status(500).send('Internal Server Error');
    }
});

// GET route for displaying the query form
router.get('/personnel', (req, res) => {
    res.render('personnel', { title: 'Query Personnel' });
});

// GET route for querying personnel by name
router.get('/search', async (req, res) => {
    const name = req.query.name;
    try {
        const personnel = await Personnel.find({ name: new RegExp(name, 'i') });
        res.json(personnel);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to query personnel' });
    }
});

// Route to fetch all personnel and render the view
router.get('/personnel', async (req, res) => {
    try {
      const personnel = await Personnel.find();
      res.render('personnel', { personnel });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
// Add or update inventory
router.post('/inventory/add', async (req, res) => {
    try {
        const { name, category, size, quantity } = req.body;

        if (!name || !category || !quantity) {
            return res.status(400).send('Name, category, and quantity are required');
        }

        const item = await Inventory.findOneAndUpdate(
            { name, category, size },
            { $inc: { quantity: quantity } },
            { upsert: true, new: true }
        );

        res.status(200).json(item);
    } catch (error) {
        console.error('Error adding/updating inventory:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Remove from inventory
router.post('/inventory/remove', async (req, res) => {
    try {
        const { name, category, size, quantity } = req.body;

        if (!name || !category || !quantity) {
            return res.status(400).send('Name, category, and quantity are required');
        }

        const item = await Inventory.findOne({ name, category, size });

        if (item) {
            if (item.quantity >= quantity) {
                item.quantity -= quantity;
                await item.save();
                res.status(200).json(item);
            } else {
                res.status(400).send('Not enough items in inventory to remove');
            }
        } else {
            res.status(404).send('Item not found');
        }
    } catch (error) {
        console.error('Error removing inventory:', error);
        res.status(500).send('Internal Server Error');
    }
});

// View all inventory
router.get('/inventory', async (req, res) => {
    try {
        const inventory = await Inventory.find();
        res.status(200).json(inventory);
    } catch (error) {
        console.error('Error fetching inventory:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
