const PDFDocument = require('pdfkit');
const fs = require('fs');

function generatePDF(data) {
  const doc = new PDFDocument();

  // Pipe the PDF into a writable stream
  doc.pipe(fs.createWriteStream('output.pdf'));

  // Add the data to the PDF
  doc.fontSize(25).text('Employee Details', { align: 'center' });

  doc.moveDown();

  doc.fontSize(16).text(`Name: ${data.name}`);

  doc.moveDown();

  doc.fontSize(16).text(`ID: ${data.id}`);

  doc.moveDown();

  doc.fontSize(16).text(`Salary: ${data.salary}`);

  // Finalize the PDF and end the stream
  doc.end();
}
