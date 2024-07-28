const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema
const hotelSchema = new Schema(
  {
    checked_date: {
      in: {
        type: Date,
        default: Date.now,
      },
      out: {
        type: Date,
        default: Date.now,
      },
    },
    hotel_name: {
      type: String,
      default: '',
    },
    reservation_no: {
      type: String,
      default: '',
    },
    guest_name: {
      type: String,
      default: '',
    },
    view: {
      type: String,
      default: '',
    },
    NTS: {
      type: Number,
      default: 0,
    },
    meal: {
      BF: {
        type: Number,
        default: 0,
      },
      LU: {
        type: Number,
        default: 0,
      },
      DI: {
        type: Number,
        default: 0,
      },
    },
    no_of_room: {
      SGL: {
        type: Number,
        default: 0,
      },
      DBL: {
        type: Number,
        default: 0,
      },
      TRL: {
        type: Number,
        default: 0,
      },
      QUAD: {
        type: Number,
        default: 0,
      },
    },
    room_rate: {
      SGL: {
        type: Number,
        default: 0,
      },
      DBL: {
        type: Number,
        default: 0,
      },
      TRL: {
        type: Number,
        default: 0,
      },
      QUAD: {
        type: Number,
        default: 0,
      },
    },
    meal_rate: {
      BF: {
        type: Number,
        default: 0,
      },
      LU: {
        type: Number,
        default: 0,
      },
      DI: {
        type: Number,
        default: 0,
      },
    },
    total_amount: {
      type: Number,
      default: 0,
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
      default: 0,
    },
  },
  { timestamps: true }
);

hotelSchema.index({ createdAt: -1 });

const Hotel = mongoose.model('Hotel', hotelSchema);
module.exports = Hotel;
