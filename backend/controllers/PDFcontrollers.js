const PDFkit = require('pdfkit');
const fs = require('fs');
const path = require('path');

const db = require('../db');
const { PDFDocument  } = require('pdf-lib');

const genPDF = (req, res) => {
  const {formTitle, status, userID, formID, partID, data} = req.body;
  console.log(formTitle, status, userID, formID, partID, data)

  const dir = path.join(__dirname, '..', 'uploads', 'generatedPdf');

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const fileName = `${formTitle}_${Date.now()}.pdf`;
  const filePath = path.join(dir, fileName);

  const doc = new PDFkit();
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

  const pageWidth = doc.page.width;
  const margin = 60;

  // part
  const foundItem = data.find(item => item.id === partID);
  doc
      .font('Sarabun-Bold')
      .fontSize(16)
      .text(`${foundItem.part}`, { align: 'center' })

  doc
      .font('Sarabun-Bold')
      .fontSize(16)
      .text(`${foundItem.description}`, { align: 'center' })

  data.map((data, dataIndex) => {

    // topic
    data.topics.map((topic, topicIndex) => {
      doc
        .moveDown() 
        .font('Sarabun-Bold')
        .fontSize(14)
        .text(`${topic.topic}`);

      // question
      topic.questions.map((question, questionIndex) => {
        doc
          .moveDown(0.3)
          .font('Sarabun-Regular')
          .fontSize(12)
          .text(`${question.question}`);

        // answer
        question.answer.length === 0 
          ? doc
              .font('Sarabun-Thin')
              .fontSize(11)
              .text('-')
          : question.answer.map((ans, ansIndex) => {
            doc
              .font('Sarabun-Thin')
              .fontSize(11)
              .text(`${ans.answer}`);
              // .text(ans.answer === '-' ? '-' : `- ${ans.answer}`);
          })
      })

      topic.children.map((child, childIndex) => {
        console.log(child)
        doc
        .moveDown() 
        .font('Sarabun-Bold')
        .fontSize(14)
        .text(`${child.topic}`);

        child.questions.map((question, questionIndex) => {
          doc
            .moveDown(0.3)
            .font('Sarabun-Regular')
            .fontSize(12)
            .text(`${question.question}`);

          // answer
          question.answer.length === 0 
            ? doc
                .font('Sarabun-Thin')
                .fontSize(11)
                .text('-')
            : question.answer.map((ans, ansIndex) => {
              doc
                .font('Sarabun-Thin')
                .fontSize(11)
                .text(`${ans.answer}`);
                // .text(ans.answer === '-' ? '-' : `- ${ans.answer}`);
            })
        })
      })
    })
  })

  doc
    .moveDown(4)
    .font('Sarabun-Regular')
    .fontSize(12)
    .text('ผู้จัดทำแผน: ............................', { align: 'right' })
    .text('           (.............................)', { align: 'right' })
    .text('วันที่ .............................', { align: 'right' });

  doc
    .moveDown(2)
    .font('Sarabun-Bold')
    .fontSize(14)
    .text('ความคิดเห็นของผู้บังคับบัญชาขั้นต้น (ผู้อำนวยการกลุ่มงาน/หัวหน้างาน) / ข้อเสนอแนะเพิ่มเติม:', { align: 'right' })
  
  doc
    .moveDown()
    .font('Sarabun-Regular')
    .fontSize(12)
    .text('..................................................................', { align: 'right' })
  
  doc
    .moveDown(1)
    .font('Sarabun-Regular')
    .fontSize(12)
    .text('ลงนาม: ..............................', { align: 'right' })
    .text('..............................', { align: 'right' })
    .text('ตำแหน่ง: ..............................', { align: 'right' })
    .text('วันที่: ..............................', { align: 'right' })
  
  doc
    .moveDown(2)
    .font('Sarabun-Bold')
    .fontSize(14)
    .text('ความคิดเห็นของผู้บังคับบัญชาเหนือขึ้นไป (ผู้อำนวยการกลุ่มกอง) / ข้อเสนอแนะเพิ่มเติม:', { align: 'right' })

  doc
    .moveDown()
    .font('Sarabun-Regular')
    .fontSize(12)
    .text('..................................................................', { align: 'right' })

  doc
    .moveDown(1)
    .font('Sarabun-Regular')
    .fontSize(12)
    .text('ลงนาม: ..............................', { align: 'right' })
    .text('..............................', { align: 'right' })
    .text('ตำแหน่ง: ..............................', { align: 'right' })
    .text('วันที่: ..............................', { align: 'right' })

  doc
    .moveDown(2)
    .moveTo(margin, doc.y)             
    .lineTo(pageWidth - margin, doc.y)  
    .strokeColor('black')
    .stroke();
  
  doc
    .moveDown(2)
    .font('Sarabun-Bold')
    .fontSize(14)
    .text('การตรวจสอบและรับรอง', { align: 'right' })
  
  doc
    .moveDown(1)
    .font('Sarabun-Regular')
    .fontSize(12)
    .text('ลงชื่อ: ..............................(เจ้าหน้าที่ กก.กพท./ผู้ตรวจสอบ)', { align: 'right' })
    .text('(..............................)', { align: 'right' })
    .text('วันที่: ..............................', { align: 'right' })


  doc.font('Sarabun-Thin').text(``);
  doc.end();

  writeStream.on('finish', () => {
    const fileUrl = `/uploads/generatedPDF/${fileName}`;
    console.log('📄 PDF saved at:', fileUrl);

    db.query(
      `INSERT INTO generatedpdf (userID, formID, partID, status, path)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         status = VALUES(status),
         path = VALUES(path)
      `,
      [userID, formID, partID, status, fileUrl],
      (err, result) => {
        if (err) {
          console.error('❌ DB insert error:', err);
          return res.status(500).json({ error: 'Failed to insert into DB' });
        }
        // console.log(result)
        res.json({ message: 'PDF saved', fileUrl });
      }
    );
  });
};

const uploadPDF = (req, res) => {
  const { fileName, time } = req.body;
  const file = req.file;
  console.log('foo')
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

const updatePdfStatus = (req, res) => {
  const { status, path, pdfID } = req.body;
  console.log(status, path, pdfID)
  
  const sql = `UPDATE generatedpdf
    SET status = ?, path = ?
    WHERE id = ?;
  `;

  db.query(sql, [status, path, pdfID], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
};

const saveEditedPdf = async (req, res) => {
  try {
    const { base64Pdf, fileName, status, pdfID } = req.body;

    const pdfBytes = Buffer.from(base64Pdf, 'base64');

    const pdfDoc = await PDFDocument .load(pdfBytes);

    const editedPdfBytes = await pdfDoc.save();

    const savePath = path.join(__dirname, '../uploads/generatedPdf', fileName);
    console.log(savePath)

    fs.writeFileSync(savePath, editedPdfBytes);

    res.json({ success: true, message: 'PDF saved', path: savePath });
  } catch (error) {
    console.error('Error saving PDF:', error);
    res.status(500).json({ success: false, error: 'Failed to save PDF' });
  }
};

const downloadEditedPdf = async (req, res) => {
  try {
    const { base64Pdf, fileName, status, pdfID } = req.body;

    const pdfBytes = Buffer.from(base64Pdf, 'base64');

    const pdfDoc = await PDFDocument .load(pdfBytes);

    const editedPdfBytes = await pdfDoc.save();

    const savePath = path.join(__dirname, '../uploads/generatedPdf', fileName);
    console.log(savePath)

    fs.writeFileSync(savePath, editedPdfBytes);

    res.json({ success: true, message: 'PDF saved', path: savePath });
  } catch (error) {
    console.error('Error saving PDF:', error);
    res.status(500).json({ success: false, error: 'Failed to save PDF' });
  }
};

const updatePdfComment = (req, res) => {
  const { comment, pdfID, accountID } = req.body;

  const sql = `
    INSERT INTO comment (comment, generatedpdfID, accountID)
    VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        comment = VALUES(comment)
      `;

  db.query(sql, [comment, pdfID, accountID], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database query error' });
    }
    res.json(result);
  });
};


module.exports = {
  genPDF,
  uploadPDF,
  deletePdfPath,
  updatePdfStatus,
  saveEditedPdf,
  updatePdfComment,
  downloadEditedPdf
};