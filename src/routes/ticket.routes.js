const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket/ticket.controller');

router.get('/', ticketController.getAllTickets);
router.get('/:id', ticketController.getTicketById);

router.get('/user/:id', ticketController.getTicketsByUserId);
router.get('/vendor/:id', ticketController.getTicketsByVendorId);
router.get(
  '/userAndVendor/:userId/:vendorId',
  ticketController.getTicketsByUserIdAndVendorId
);
router.post('/', ticketController.createTicket);
router.patch('/:id', ticketController.updateTicket);
router.delete('/:id', ticketController.deleteTicket);

module.exports = router;
