const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vendorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
  },
  company_name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

const Vendor = mongoose.model('Vendor', vendorSchema);
module.exports = Vendor;
