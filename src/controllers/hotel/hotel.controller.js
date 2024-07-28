const Reservation = require('../../models/hotel');
const { findRecentHotel, mapHotelPayload } = require('./helpers');
const generatePdf = require('./generatePDF');

const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.status(200).send(reservations);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).send();
    }
    res.status(200).send(reservation);
  } catch (error) {
    res.status(500).send(error);
  }
};

const createReservation = async (req, res) => {
  try {
    console.log('working hotels', req.body);
    const apiPayload = mapHotelPayload(req.body);
    console.log('working hotels payload', apiPayload);

    const { vendor_ID } = apiPayload;
    const { payment_type, total_amount } = req.body;

    if (payment_type === 'credit') {
      apiPayload.credit = parseFloat(total_amount);
    } else if (payment_type === 'debit') {
      apiPayload.debit = parseFloat(total_amount);
    }

    const recentHotel = await findRecentHotel(vendor_ID);

    if (recentHotel) {
      if (payment_type === 'credit') {
        apiPayload.balance = recentHotel.balance - apiPayload.credit;
      } else if (payment_type === 'debit') {
        apiPayload.balance = recentHotel.balance + apiPayload.debit;
      }
    } else {
      if (payment_type === 'credit') {
        apiPayload.balance -= apiPayload.credit;
      } else if (payment_type === 'debit') {
        apiPayload.balance += apiPayload.debit;
      }
    }
    console.log('my hotel data is :', apiPayload);
    const reservation = new Reservation(apiPayload);

    await reservation.save();
    res.status(201).send(reservation);
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!reservation) {
      return res.status(404).send();
    }
    res.status(200).send(reservation);
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation) {
      return res.status(404).send();
    }
    res.status(200).send(reservation);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getReservationsByUserId = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user_ID: req.params.userId });
    if (reservations.length === 0) {
      return res
        .status(404)
        .send({ message: 'No reservations found for this user' });
    }
    res.status(200).send(reservations);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getReservationsByVendorId = async (req, res) => {
  try {
    const reservations = await Reservation.find({
      vendor_ID: req.params.id,
    });
    if (reservations.length === 0) {
      return res
        .status(404)
        .send({ message: 'No reservations found for this vendor' });
    }
    res.status(200).send(reservations);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getReservationsByUserAndVendor = async (req, res) => {
  try {
    const { userId, vendorId } = req.params;
    console.log(userId, vendorId);
    const reservations = await Reservation.find({
      user_ID: userId,
      vendor_ID: vendorId,
    });
    if (reservations.length === 0) {
      return res.status(404).send({
        message: 'No reservations found for this user and vendor combination',
      });
    }
    res.status(200).send(reservations);
  } catch (error) {
    res.status(500).send(error);
  }
};

const createPdf = async (req, res) => {
  try {
    const pdfBytes = await generatePdf();
    console.log('pdf bytes', pdfBytes);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
    res.send(pdfBytes);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  createPdf,
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation,
  getReservationsByUserId,
  getReservationsByVendorId,
  getReservationsByUserAndVendor,
};
