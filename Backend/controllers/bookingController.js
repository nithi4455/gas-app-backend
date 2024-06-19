// controllers/bookingController.js

const Booking = require('../models/Booking');
const GasProvider = require('../models/GasProvider');

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('gasProviderId', ['name', 'description']);
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('gasProviderId', ['name', 'description']);
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    res.status(500).send('Server error');
  }
};

exports.createBooking = async (req, res) => {
  const { gasProviderId, slot } = req.body;

  try {
    const provider = await GasProvider.findById(gasProviderId);
    if (!provider) {
      return res.status(404).json({ msg: 'Provider not found' });
    }

    const newBooking = new Booking({
      user: req.user.id,
      gasProviderId,
      slot
    });

    const booking = await newBooking.save();
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateBooking = async (req, res) => {
  const { slot } = req.body;

  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ msg: 'Booking not found' });

    booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: { slot } },
      { new: true }
    );

    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    await booking.remove();

    res.json({ msg: 'Booking removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    res.status(500).send('Server error');
  }
};
