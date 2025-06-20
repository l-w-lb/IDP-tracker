const PDFkit = require('pdfkit');
const fs = require('fs');
const path = require('path');

const db = require('../db');
const { PDFDocument  } = require('pdf-lib');

const totalTime = (time) => {
    const totalInSeconds = time.reduce((acc, time) => acc + timeToSeconds(time.answer), 0);
    const totalTimeValue = secondsToTime(totalInSeconds);
    return totalTimeValue
  }

  function timeToSeconds(timeStr) {
    const [h = 0, m = 0, s = 0] = timeStr.split(':').map(Number);
    return h * 3600 + m * 60 + s;
  }

  function secondsToTime(totalSeconds) {
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

function renderTopic(doc, parent, topic, margin) {
  doc
    .moveDown() 
    .font('Sarabun-Bold')
    .fontSize(14)
    .text(`${topic.topic}`)

  if (parent 
      // ? (parent.type === 'multipleAnswer' && topic.type === "singleAnswer") 
      ? (parent.type === 'multipleAnswer' || parent.type === 'dynamicQuestion') 
      : topic.type === 'multipleAnswer') {
    const pageWidth = doc.page.width;
    const usableWidth = pageWidth - margin * 2;
    const colWidth = usableWidth / topic.questions.length;

    let startX = margin;
    let startY = doc.y + 15;

    const questionRowHeight = 25;  
    const answerRowHeight = 70;    
    const spaceAfterHeader = 65; 


    const filteredQuestions = topic.questions.filter(q => q.question !== '');
    const newColWidth = usableWidth / filteredQuestions.length;

    const pageHeight = doc.page.height;

    filteredQuestions.forEach((question, i) => {
      const estimatedHeight = doc.heightOfString(question.question || '-', {
        width: newColWidth,
        align: 'center',
        font: 'Sarabun-Regular',
        fontSize: 12
      });

      if (doc.y + estimatedHeight > pageHeight - margin) {
        doc.addPage();
        startY = margin; // รีเซตตำแหน่งเริ่มต้น
      }

      doc
        .font('Sarabun-Regular')
        .fontSize(12)
        .text(question.question, startX + i * newColWidth, startY, {
          width: newColWidth,
          align: 'center'
        })
        .moveDown(0.3);
    });



    startY += questionRowHeight + spaceAfterHeader;
    const maxAnswers = Math.max(
      ...topic.questions.map(q => q.answer?.length || 0)
    );

    const contentBottomY = startY + (maxAnswers * answerRowHeight);

    if (contentBottomY > pageHeight - margin) {
      doc.addPage();
      startY = margin; // reset Y ตำแหน่งบนของหน้าใหม่
    }

    let sum = null;

    for (let row = 0; row < maxAnswers; row++) {
      filteredQuestions.forEach((question, colIndex) => {
        const ans = question.answer?.[row]?.answer.replace('/uploads/answers/', '').trim() ?? '-';
        if (question.question !== '') {
          doc
            .font('Sarabun-Thin')
            .fontSize(11)
            .text(ans, startX + colIndex * newColWidth, startY + row * 70, {
              width: newColWidth,
              align: 'center'
            });
          
          if (question.questionDetail?.sum === 0) {
            sum = 0;
            question.answer.map((ans, ansIndex) => {
              sum = sum += ans.answer
            })
          }
        }
      });
    }

    doc.y = startY + maxAnswers * answerRowHeight;
    doc.x = margin;
    if (sum !== null) {
      doc
        .font('Sarabun-Bold')
        .fontSize(11)
        .text(`Total: ${sum}`)
    }

    doc.moveDown(1);

  } else if (topic.type === 'multipleFile') {
    const questionHeights = [];
    topic.questions.forEach((question, i) => {
      const text = question.question || '-';
      const { height } = doc.heightOfString(text, {
        width: colWidth,
        align: 'center',
        font: 'Sarabun-Regular',
        fontSize: 12
      });

      questionHeights.push(height);

      // if (question.questionDetail?.sum === 0) {
      //   console.log(question.question)
      // }

      doc
        .font('Sarabun-Regular')
        .fontSize(12)
        .text(text, startX + i * colWidth, startY, {
          width: colWidth,
          align: 'center'
        });

          if (question.type !== 'none') {
            if (question.answer.length === 0) {
              doc
                .font('Sarabun-Thin')
                .fontSize(11)
                .text('-');
            } else {
              question.answer.forEach((ans) => {
                const cleanAnswer = ans.answer
                  ? ans.answer.replace('/uploads/generatedpdf', '').trim()
                  : '-';

                doc
                  .font('Sarabun-Thin')
                  .fontSize(11)
                  .text(cleanAnswer);
              });
            }
          }
      });
      doc.moveDown(1);
  } else {
    if (topic.type === 'dynamicQuestion') {
      
    } else {
      topic.questions.forEach((question) => {
        doc
          .moveDown(0.5)
          .font('Sarabun-Regular')
          .fontSize(12)
          .text(`${question.question}`)
          .moveDown(0.3);

          if (question.type !== 'none') {
            if (question.answer.length === 0) {
              doc
                .font('Sarabun-Thin')
                .fontSize(11)
                .text('-');
            } else {
              question.answer.forEach((ans) => {
                doc
                  .font('Sarabun-Thin')
                  .fontSize(11)
                  .text(`${ans.answer ? ans.answer : '-'}`);
              }
            );
          }}
      });
      doc.moveDown(1);
    }
  }

  
  doc.x = margin;
}


const genPDF = (req, res) => {
  const {formTitle, status, userID, formID, partID, data} = req.body;
  // console.log(formTitle, status, userID, formID, partID, data)

  const dir = path.join(__dirname, '..', 'uploads', 'generatedPdf');

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const date = Date.now()
  const fileName = `${formTitle}_${date}.pdf`;
  const filePath = path.join(dir, fileName);

  // const readableDate = new Date(date).toLocaleString();

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

  doc.x = margin;

  // part
  const foundItem = data.find(item => item.id === partID);
  doc
      .font('Sarabun-Bold')
      .fontSize(16)
      .text(`${foundItem.part}`, { align: 'center' })

  doc
      .font('Sarabun-Bold')
      .fontSize(16)
      .text(`${foundItem.description ? foundItem.description : ''}`, { align: 'center' })

  data.map((data, dataIndex) => {

    // topic
    data.topics.forEach((topic) => {
      renderTopic(doc, null, topic, margin);

      // children
      topic.children.forEach((child) => {
        renderTopic(doc, topic, child, margin);
      });
    });

  })

  doc
    .moveDown(4)
    .font('Sarabun-Regular')
    .fontSize(12)
    .text('ผู้จัดทำแผน: ........................................................', { align: 'right' })
    .moveDown(0.3)
    .text('           (.........................................................)', { align: 'right' })
    .moveDown(0.3)
    .text('วันที่ .........................................................', { align: 'right' });

  doc
    .moveDown(2)
    .font('Sarabun-Bold')
    .fontSize(14)
    .text('ความคิดเห็นของผู้บังคับบัญชาขั้นต้น (ผู้อำนวยการกลุ่มงาน/หัวหน้างาน) / ข้อเสนอแนะเพิ่มเติม:', { align: 'right' })
  
  doc
    .moveDown()
    .font('Sarabun-Regular')
    .fontSize(12)
    .text('....................................................................................................................................', { align: 'right' })
  
  doc
    .moveDown(1)
    .font('Sarabun-Regular')
    .fontSize(12)
    .text('ลงนาม: ............................................................', { align: 'right' })
    .moveDown(0.3)
    .text('(............................................................)', { align: 'right' })
    .moveDown(0.3)
    .text('ตำแหน่ง: ............................................................', { align: 'right' })
    .moveDown(0.3)
    .text('วันที่: ............................................................', { align: 'right' })
  
  doc
    .moveDown(2)
    .font('Sarabun-Bold')
    .fontSize(14)
    .text('ความคิดเห็นของผู้บังคับบัญชาเหนือขึ้นไป (ผู้อำนวยการกลุ่มกอง) / ข้อเสนอแนะเพิ่มเติม:', { align: 'right' })

  doc
    .moveDown()
    .font('Sarabun-Regular')
    .fontSize(12)
    .text('....................................................................................................................................', { align: 'right' })

  doc
    .moveDown(1)
    .font('Sarabun-Regular')
    .fontSize(12)
    .text('ลงนาม: ............................................................', { align: 'right' })
    .moveDown(0.3)
    .text('(............................................................)', { align: 'right' })
    .moveDown(0.3)
    .text('ตำแหน่ง: ............................................................', { align: 'right' })
    .moveDown(0.3)
    .text('วันที่: ............................................................', { align: 'right' })

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
    .text('ลงชื่อ: ............................................................(เจ้าหน้าที่ กก.กพท./ผู้ตรวจสอบ)', { align: 'right' })
    .moveDown(0.3)
    .text('(............................................................)', { align: 'right' })
    .moveDown(0.3)
    .text('วันที่: ............................................................', { align: 'right' })


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
  console.log('//',fileName, time)
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

const updatePdfDate = (req, res) => {
  const { date, pdfID } = req.body;
  console.log(date, pdfID)
  
  const sql = `UPDATE generatedpdf
    SET date = ?
    WHERE id = ?;
  `;

  db.query(sql, [date, pdfID], (err, result) => {
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
  downloadEditedPdf,
  updatePdfDate
};