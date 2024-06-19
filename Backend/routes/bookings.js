const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking'); 
const { getAllBookings, getBookingById, createBooking, updateBooking, deleteBooking } = require('../controllers/bookingController');
const auth = require('../middleware/auth');

router.get('/', auth, getAllBookings);
router.get('/:id', auth, getBookingById);
router.post('/', auth, createBooking);
router.put('/:id', auth, updateBooking);
router.delete('/:id', auth, deleteBooking);

// Get user bookings
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).populate('gasProviderId');
    res.json(bookings);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Create a booking
router.post('/', auth, async (req, res) => {
  try {
    const { gasProviderId, slot } = req.body;
    const newBooking = new Booking({ userId: req.user.id, gasProviderId, slot });
    await newBooking.save();
    res.json(newBooking);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Update a booking
router.put('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking || booking.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Unauthorized' });
    
    booking.slot = req.body.slot || booking.slot;
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Delete a booking
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking || booking.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Unauthorized' });
    
    await booking.remove();
    res.json({ msg: 'Booking removed' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
