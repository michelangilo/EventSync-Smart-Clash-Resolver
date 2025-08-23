const express = require('express');
const Venue = require('../models/Venue');
const router = express.Router();

// GET all venues
router.get('/', async (req, res) => {
  try {
    const venues = await Venue.find().sort({ name: 1 });
    return res.json(venues);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET venue by ID
router.get('/:id', async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) {
      return res.status(404).json({ error: 'Venue not found' });
    }
    return res.json(venue);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST create venue
router.post('/', async (req, res) => {
  try {
    const { name, location, capacity } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Venue name is required' });
    }

    // Check if venue name already exists
    const existingVenue = await Venue.findOne({ name });
    if (existingVenue) {
      return res.status(409).json({ error: 'Venue name already exists' });
    }

    const venue = new Venue({
      name: name.trim(),
      location: location?.trim(),
      capacity: capacity ? parseInt(capacity) : undefined
    });

    await venue.save();
    return res.status(201).json(venue);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// PUT update venue
router.put('/:id', async (req, res) => {
  try {
    const venueId = req.params.id;
    const { name, location, capacity } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Venue name is required' });
    }

    // Check if venue exists
    const existingVenue = await Venue.findById(venueId);
    if (!existingVenue) {
      return res.status(404).json({ error: 'Venue not found' });
    }

    // Check if new name conflicts with another venue
    const nameConflict = await Venue.findOne({ 
      name: name.trim(), 
      _id: { $ne: venueId } 
    });
    if (nameConflict) {
      return res.status(409).json({ error: 'Venue name already exists' });
    }

    const updatedVenue = await Venue.findByIdAndUpdate(
      venueId,
      {
        name: name.trim(),
        location: location?.trim(),
        capacity: capacity ? parseInt(capacity) : undefined
      },
      { new: true }
    );

    return res.json(updatedVenue);
  } catch (err) {
    console.error('Update venue error:', err);
    return res.status(500).json({ error: 'Failed to update venue' });
  }
});

// DELETE venue
router.delete('/:id', async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) {
      return res.status(404).json({ error: 'Venue not found' });
    }

    await Venue.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Venue deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
