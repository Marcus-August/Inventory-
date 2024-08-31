const express = require('express');
const router = express.Router();
const Personnel = require('../models/Personnel');

// Function to display the add inventory form
function getAddInventory(req, res) {
    // Implementation logic for displaying the add inventory form
    res.render('add_inventory', { title: 'Add Inventory' });
}

// Function to handle the add inventory form submission
function postAddInventory(req, res) {
    // Implementation logic for handling the add inventory form submission
    // This could involve processing form data and saving it to the database
    res.send('Add inventory form submitted');
}

// Function to get all personnel
async function getAllPersonnel(req, res) {
    try {
        const personnel = await Personnel.find();
        res.render('personnel', { title: 'All Personnel', personnel });
    } catch (error) {
        console.error('Error fetching personnel:', error);
        res.status(500).send('Internal Server Error');
    }
}

// Function to get personnel by ID
function getPersonnelById(req, res) {
    // Implementation logic for getting personnel by ID
    // This could involve fetching data from the database based on the ID parameter
    res.send(`Get personnel by ID: ${req.params.id}`);
}

// Function to delete personnel by ID
async function deletePersonnelById(req, res) {
    const personnelId = req.params.id;

    try {
        // Find the personnel by ID and delete it
        const deletedPersonnel = await Personnel.findByIdAndDelete(personnelId);
        
        // Check if personnel was found and deleted
        if (!deletedPersonnel) {
            return res.status(404).send('Personnel not found');
        }
        
        // Send success response
        res.status(200).send('Personnel deleted successfully');
    } catch (error) {
        console.error('Error deleting personnel:', error);
        res.status(500).send('Internal Server Error');
    }
}

// Export the controller methods
module.exports = {
    getAddInventory,
    postAddInventory,
    getAllPersonnel,
    getPersonnelById,
    deletePersonnelById
};
