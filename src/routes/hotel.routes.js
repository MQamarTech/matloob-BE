const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const reservationController = require('../controllers/hotel/hotel.controller');
router.get('/', reservationController.getAllReservations);
router.get('/:id', reservationController.getReservationById);
router.get('/user/:id', reservationController.getReservationsByUserId);
router.get('/vendor/:id', reservationController.getReservationsByVendorId);

router.get(
  '/userAndVendor/:userId/:vendorId',
  reservationController.getReservationsByUserAndVendor
);
router.post('/generate-pdf', reservationController.createPdf);
router.post('/', reservationController.createReservation);
router.patch('/:id', reservationController.updateReservation);
router.delete('/:id', reservationController.deleteReservation);
router.post('/send-email', async (req, res) => {
  const { email, subject, message } = req.body;
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: 'husnain.batman@gamil.com',
      pass: '!*husnain.Husnain.2484*!',
    },
  });

  if (!email || !subject || !message) {
    return res
      .status(400)
      .json({ error: 'Please provide email, subject, and message' });
  }

  try {
    // Create a transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: 'gmail', // e.g., 'gmail'
      auth: {
        user: 'husnain.batman@gamil.com', // your email
        pass: '!*husnain.Husnain.2484*!', // your email password
      },
    });

    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: 'husnain.batman@gamil.com', // sender address
      to: 'mqamartech@gmail.com', // list of receivers
      subject: 'Hello ✔', // Subject line
      text: 'Hello world?', // plain text body
      html: '<b>Hello world?</b>', // html body
    });

    res.status(200).json({ message: 'Email sent successfully', info });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Failed to send email', details: error.message });
  }
});

router.post('/generate-pdf', (req, res) => {
  const { name, id, score, companyName } = req.body;

  const doc = new PDFDocument();
  const filePath = `./output/${id}_report.pdf`;

  // Ensure the output directory exists
  if (!fs.existsSync('./output')) {
    fs.mkdirSync('./output');
  }

  // Stream the PDF to a file
  doc.pipe(fs.createWriteStream(filePath));

  // Add content to the PDF
  doc.fontSize(25).text('Report', { align: 'center' });

  doc
    .moveDown()
    .fontSize(16)
    .text(`Name: ${name}`)
    .text(`ID: ${id}`)
    .text(`Score: ${score}`)
    .text(`Company Name: ${companyName}`);

  // Finalize the PDF and end the stream
  doc.end();

  doc.on('finish', () => {
    res.status(200).json({ message: 'PDF generated successfully', filePath });
  });

  doc.on('error', (err) => {
    console.error(err);
    res.status(500).json({ message: 'Error generating PDF', error: err });
  });
});

module.exports = router;
