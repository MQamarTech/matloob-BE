// helpers.js

const Hotel = require('../../models/hotel');

// Helper function to find the most recent ticket
const findRecentHotel = async (vendor_ID) => {
  try {
    const hotels = await Hotel.find({ vendor_ID }).sort({
      createdAt: -1,
    });

    if (hotels.length === 0) {
      return null;
    }

    const recentHotels = hotels[0];
    return recentHotels;
  } catch (error) {
    throw new Error('Error finding tickets');
  }
};

function mapHotelPayload(payload) {
  return {
    checked_date: {
      in: new Date(payload.checked_in_date),
      out: new Date(payload.checked_out_date),
    },
    hotel_name: payload.hotel_name || '',
    reservation_no: payload.reservation_number || '',
    guest_name: payload.guest_name || '',
    view: payload.view || '',
    NTS: parseInt(payload.nts) || 0,
    meal: {
      BF: parseInt(payload.bf) || 0,
      LU: parseInt(payload.lu) || 0,
      DI: parseInt(payload.di) || 0,
    },
    no_of_room: {
      SGL: parseInt(payload.sgl) || 0,
      DBL: parseInt(payload.dbl) || 0,
      TRL: parseInt(payload.trl) || 0,
      QUAD: parseInt(payload.quad) || 0,
    },
    room_rate: {
      SGL: parseFloat(payload.sgl_rate) || 0.0,
      DBL: parseFloat(payload.dbl_rate) || 0.0,
      TRL: parseFloat(payload.trl_rate) || 0.0,
      QUAD: parseFloat(payload.quad_rate) || 0.0,
    },
    meal_rate: {
      BF: parseFloat(payload.bf_rate) || 0.0,
      LU: parseFloat(payload.lu_rate) || 0.0,
      DI: parseFloat(payload.di_rate) || 0.0,
    },
    total_amount: parseFloat(payload.total_amount) || 0.0,

    debit: 0.0,
    credit: 0.0, // Assuming credit is not provided in the payload
    balance: 0.0, // Assuming balance needs to be calculated separately
    // Add user_ID and vendor_ID if they are provided in the payload
    //vendor_ID: payload?.vendor_ID,
    vendor_ID: '66a502da612112d2b0973634',
  };
}

module.exports = {
  findRecentHotel,
  mapHotelPayload,
};
