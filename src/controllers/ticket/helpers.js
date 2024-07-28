// helpers.js

const Ticket = require('../../models/ticket'); // Assuming you have a Ticket model

// Helper function to find the most recent ticket
const findRecentTicket = async (vendor_ID) => {
  try {
    const tickets = await Ticket.find({ vendor_ID }).sort({
      createdAt: -1,
    });

    if (tickets.length === 0) {
      return null;
    }

    const recentTicket = tickets[0];
    return recentTicket;
  } catch (error) {
    throw new Error('Error finding tickets');
  }
};
module.exports = {
  findRecentTicket,
};
