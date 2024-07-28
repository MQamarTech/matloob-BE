const Ticket = require('../../models/ticket');
const { findRecentTicket } = require('./helpers');

const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({});
    res.status(200).send(tickets);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getTicketsByUserId = async (req, res) => {
  try {
    const userID = req.params.userId;
    const tickets = await Ticket.find({ userId: userID });
    if (tickets.length === 0) {
      return res
        .status(404)
        .send({ message: 'No tickets found for this user' });
    }
    res.status(200).send(tickets);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Retrieve all tickets for a specific vendor ID
const getTicketsByVendorId = async (req, res) => {
  try {
    const vendorId = req.params.id;

    console.log('vendor Id in   controller: ', vendorId);
    const tickets = await Ticket.find({ vendor_ID: vendorId });
    console.log(tickets);
    if (tickets.length === 0) {
      return res
        .status(404)
        .send({ message: 'No tickets found for this vendor' });
    }
    res.status(200).send(tickets);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Retrieve all tickets for a specific user ID and vendor ID
const getTicketsByUserIdAndVendorId = async (req, res) => {
  try {
    const { userId, vendorId } = req.params;

    const tickets = await Ticket.find({
      user_ID: userId,
      vendor_ID: vendorId,
    });
    if (tickets.length === 0) {
      return res.status(404).send({
        message: 'No tickets found for this user and vendor combination',
      });
    }
    res.status(200).send(tickets);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate(
      'user_ID vendor_ID'
    );
    if (!ticket) {
      return res.status(404).send();
    }
    res.status(200).send(ticket);
  } catch (error) {
    res.status(500).send(error);
  }
};

const createTicket = async (req, res) => {
  console.log('working ticket controllers');
  try {
    const { vendor, date, description, payment_method, total_amount } =
      req.body;

    const recentTicket = await findRecentTicket(vendor);

    const apiPayload = {
      vendor_ID: vendor,
      description: description,
      date: date,
      credit: 0,
      debit: 0,
      balance: 0,
    };

    console.log('actual payload', apiPayload);
    if (payment_method === 'credit') {
      apiPayload.credit = parseFloat(total_amount);
    } else if (payment_method === 'debit') {
      apiPayload.debit = parseFloat(total_amount);
    }

    if (recentTicket) {
      if (payment_method === 'credit') {
        apiPayload.balance = recentTicket.balance - apiPayload.credit;
      } else if (payment_method === 'debit') {
        apiPayload.balance = recentTicket.balance + apiPayload.debit;
      }
    } else {
      if (payment_method === 'credit') {
        apiPayload.balance -= apiPayload.credit;
      } else if (payment_method === 'debit') {
        apiPayload.balance += apiPayload.debit;
      }
    }

    const ticket = new Ticket(apiPayload);

    console.log('data: ', ticket);

    await ticket.save();
    res.status(201).send(ticket);
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!ticket) {
      return res.status(404).send();
    }
    res.status(200).send(ticket);
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) {
      return res.status(404).send();
    }
    res.status(200).send(ticket);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getRecentTicketByUserAndVendor = async (req, res) => {
  try {
    const { user_ID, vendor_ID } = req.body;

    // Find the most recent ticket for the given user and vendor
    const ticket = await Ticket.findOne({ user_ID, vendor_ID })
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order to get the most recent
      .populate('user_ID vendor_ID');

    if (!ticket) {
      return res.status(404).send({
        message: 'No recent ticket found for this user and vendor combination',
      });
    }

    // Log the ticket data (could use a logger or simply console.log)
    console.log('Recent Ticket:', ticket);

    res.status(200).send(ticket);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  getTicketsByUserId,
  getTicketsByVendorId,
  getTicketsByUserIdAndVendorId,
  getRecentTicketByUserAndVendor,
};
