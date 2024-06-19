const mongoose = require('mongoose');

const GasProviderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  availableSlots: [Date]
});

module.exports = mongoose.model('GasProvider', GasProviderSchema);
