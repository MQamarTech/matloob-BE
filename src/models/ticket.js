const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ticketSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    vendor_ID: {
      type: Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
    },
    debit: {
      type: Number,
      default: 0,
    },
    credit: {
      type: Number,
      default: 0,
    },
    balance: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
ticketSchema.index({ createdAt: -1 });
const Ticket = mongoose.model('Ticket', ticketSchema);
module.exports = Ticket;
