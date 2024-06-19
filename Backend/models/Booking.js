const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  gasProviderId: { type: mongoose.Schema.Types.ObjectId, ref: 'GasProvider', required: true },
  slot: { type: Date, required: true },
  status: { type: String, default: 'booked' }
});

module.exports = mongoose.model('Booking', BookingSchema);
