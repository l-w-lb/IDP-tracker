const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const db = require('../db');

const genPDF = (req, res) => {
  const {formTitle, username, userID, formID, data} = req.body;
  // console.log(formTitle, username, userID, formID, data)

  const dir = path.join(__dirname, '..', 'uploads', 'generatedPdf');

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const fileName = `${formTitle}_${Date.now()}.pdf`;
  const filePath = path.join(dir, fileName);

  const doc = new PDFDocument();
  const writeStream = fs.createWriteStream(filePath);

  const fontPath = path.join(__dirname, '..', 'fonts', 'Sarabun', 'Sarabun-Medium.ttf');
  doc.registerFont('Sarabun', fontPath);
  doc.font('Sarabun');

  const fontPathRegular = path.join(__dirname, '..', 'fonts', 'Sarabun', 'Sarabun-Regular.ttf');
  const fontPathBold = path.join(__dirname, '..', 'fonts', 'Sarabun', 'Sarabun-Bold.ttf');
  const fontPathThin = path.join(__dirname, '..', 'fonts', 'Sarabun', 'Sarabun-Thin.ttf');

  doc.registerFont('Sarabun-Regular', fontPathRegular);
  doc.registerFont('Sarabun-Bold', fontPathBold);
  doc.registerFont('Sarabun-Thin', fontPathThin);

  doc.pipe(writeStream);
  data.map((data, dataIndex) => {
    doc.font('Sarabun-Bold').text(`${data.part}`);
    data.topics.map((topic, topicIndex) => {
      doc.font('Sarabun-Bold').text(`${topic.topic}`);
      topic.questions.map((question, questionIndex) => {
        doc.font('Sarabun-Regular').text(`${question.question}`);
        question.answer.map((ans, ansIndex) => {
          doc.font('Sarabun-Thin').text(`${ans.answer}`);
        })
      })
    })
  })
  doc.font('Sarabun-Thin').text(``);
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

const deletePdfPath = (req, res) => {
  const filePath = req.body.path.trim()
  const wholePath = path.join(__dirname, '..', filePath);

  fs.unlink(wholePath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'ลบไฟล์ไม่สำเร็จ' });
    }
    res.json({ message: 'ลบไฟล์สำเร็จ' });
  });
};

module.exports = {
  genPDF,
  uploadPDF,
  deletePdfPath
};