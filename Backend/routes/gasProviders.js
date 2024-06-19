const express = require('express');
const router = express.Router();
const GasProvider = require('../models/GasProvider');

// Get all gas providers
router.get('/', async (req, res) => {
  try {
    const providers = await GasProvider.find();
    res.json(providers);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Search and filter providers
router.get('/search', async (req, res) => {
  try {
    const { name, category } = req.query;
    const query = {};
    if (name) query.name = new RegExp(name, 'i');
    if (category) query.category = category;
    const providers = await GasProvider.find(query);
    res.json(providers);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
