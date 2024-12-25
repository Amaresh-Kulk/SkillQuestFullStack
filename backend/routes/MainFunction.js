const express = require('express');
const MainFunction = require('../models/MainFunction'); // Adjust path if necessary
const router = express.Router();

// Create a main function
router.post('/', async (req, res) => {
  const { question_id, mainFunction } = req.body;

  try {
    const newMainFunction = new MainFunction({ question_id, mainFunction });
    await newMainFunction.save();
    res.status(201).json(newMainFunction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add main function', details: error.message });
  }
});

// Read main functions (all or by question_id)
router.get('/', async (req, res) => {
  const { question_id } = req.query;

  try {
    const query = question_id ? { question_id } : {};
    const mainFunctions = await MainFunction.find(query);
    res.status(200).json(mainFunctions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve main functions', details: error.message });
  }
});

// Update a main function
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { mainFunction } = req.body;

  try {
    const updatedMainFunction = await MainFunction.findByIdAndUpdate(
      id,
      { mainFunction },
      { new: true }
    );
    if (!updatedMainFunction) {
      return res.status(404).json({ error: 'Main function not found' });
    }
    res.status(200).json(updatedMainFunction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update main function', details: error.message });
  }
});

// Delete a main function
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedMainFunction = await MainFunction.findByIdAndDelete(id);
    if (!deletedMainFunction) {
      return res.status(404).json({ error: 'Main function not found' });
    }
    res.status(200).json(deletedMainFunction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete main function', details: error.message });
  }
});

module.exports = router;
