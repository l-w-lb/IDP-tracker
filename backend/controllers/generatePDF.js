const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const db = require('../db');

const genPDF = (req, res) => {
  const {formTitle, username, userID, formID} = req.body;
  console.log(formTitle, username, userID, formID)

  const doc = new PDFDocument();
  const fileName = `${formTitle}_${Date.now()}.pdf`;
  const filePath = path.join(__dirname, '..', 'uploads', fileName);

  const writeStream = fs.createWriteStream(filePath);

  doc.pipe(writeStream);
  doc.text(`name: ${username}`);
  // doc.text(`ตำแหน่ง: ${req.body.position}`);
  doc.end();

  writeStream.on('finish', () => {
    const fileUrl = `/uploads/${fileName}`;
    console.log('📄 PDF saved at:', fileUrl);

    db.query(
      `INSERT INTO generatedpdf (userID, formID, status, path) VALUES (?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
          status = VALUES(status),
          path = VALUES(path)
     `,
      [userID, formID, 'รอการอนุมัติ', fileUrl],
      (err, result) => {
        if (err) {
          console.error('❌ DB insert error:', err);
          return res.status(500).json({ error: 'Failed to insert into DB' });
        }

        res.json({ message: 'PDF saved', fileUrl });
      }
    );
  });
};

module.exports = {
  genPDF
};