const Vendor = require('../../models/vendor');

const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.status(200).send(vendors);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getAllVendorsByType = async (req, res) => {
  try {
    const { type } = req.query; // Get the type from query parameters
    const vendors = await Vendor.find({ type }); // Filter vendors based on type
    res.status(200).send(vendors);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).send();
    }
    res.status(200).send(vendor);
  } catch (error) {
    res.status(500).send(error);
  }
};

const createVendor = async (req, res) => {
  try {
    console.log('payload', req.body);
    const vendor = new Vendor(req.body);
    await vendor.save();
    res.status(201).send(vendor);
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!vendor) {
      return res.status(404).send();
    }
    res.status(200).send(vendor);
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!vendor) {
      return res.status(404).send();
    }
    res.status(200).send(vendor);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  getAllVendors,
  getVendorById,
  createVendor,
  updateVendor,
  deleteVendor,
  getAllVendorsByType,
};
