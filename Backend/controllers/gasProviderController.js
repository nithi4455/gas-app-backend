// controllers/gasProviderController.js

const GasProvider = require('../models/GasProvider');

exports.getAllProviders = async (req, res) => {
  try {
    const providers = await GasProvider.find();
    res.json(providers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getProviderById = async (req, res) => {
  try {
    const provider = await GasProvider.findById(req.params.id);
    if (!provider) {
      return res.status(404).json({ msg: 'Provider not found' });
    }
    res.json(provider);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Provider not found' });
    }
    res.status(500).send('Server error');
  }
};

exports.createProvider = async (req, res) => {
  const { name, description, contactInfo } = req.body;

  try {
    const newProvider = new GasProvider({
      name,
      description,
      contactInfo
    });

    const provider = await newProvider.save();
    res.json(provider);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateProvider = async (req, res) => {
  const { name, description, contactInfo } = req.body;

  const providerFields = {};
  if (name) providerFields.name = name;
  if (description) providerFields.description = description;
  if (contactInfo) providerFields.contactInfo = contactInfo;

  try {
    let provider = await GasProvider.findById(req.params.id);

    if (!provider) return res.status(404).json({ msg: 'Provider not found' });

    provider = await GasProvider.findByIdAndUpdate(
      req.params.id,
      { $set: providerFields },
      { new: true }
    );

    res.json(provider);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteProvider = async (req, res) => {
  try {
    const provider = await GasProvider.findById(req.params.id);

    if (!provider) {
      return res.status(404).json({ msg: 'Provider not found' });
    }

    await provider.remove();

    res.json({ msg: 'Provider removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Provider not found' });
    }
    res.status(500).send('Server error');
  }
};
