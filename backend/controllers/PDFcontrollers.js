const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const db = require('../db');

const genPDF = (req, res) => {
  const {formTitle, username, userID, formID} = req.body;
  console.log(formTitle, username, userID, formID)

  const dir = path.join(__dirname, '..', 'uploads', 'generatedPdf');

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const fileName = `${formTitle}_${Date.now()}.pdf`;
  const filePath = path.join(dir, fileName);

  const doc = new PDFDocument();
  const writeStream = fs.createWriteStream(filePath);

  doc.pipe(writeStream);
  doc.text(`name: ${username}`);
  doc.end();

  writeStream.on('finish', () => {
    const fileUrl = `/uploads/generatedPDF/${fileName}`;
    console.log('📄 PDF saved at:', fileUrl);

    db.query(
      `INSERT INTO generatedpdf (userID, formID, status, path)
       VALUES (?, ?, ?, ?)
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

const uploadPDF = (req, res) => {
  const { fileName, time } = req.body;
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const oldPath = file.path;
  const ext = path.extname(file.originalname);
  const newPath = path.join(file.destination, fileName.split('/').pop());
  fs.rename(oldPath, newPath, (err) => {
    if (err) return res.status(500).json({ error: 'Rename failed' });
    
    console.log('📄 PDF saved at:', fileName);
    res.json({ message: 'PDF uploaded successfully', fileName });
  });
};

module.exports = {
  genPDF,
  uploadPDF
};