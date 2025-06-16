const db = require('../db');

const getForm = (req, res) => {
  const { userID } = req.body;
  const sql = `SELECT 
        form.title, 
        generatedpdf.path, 
        generatedpdf.status, 
        form.id AS formID,
        part.text AS part,
        part.id AS partID,
        generatedpdf.id AS pdfID
      FROM part
      LEFT JOIN generatedpdf 
        ON part.id = generatedpdf.partID 
        AND generatedpdf.userID = ?
      JOIN form ON form.id = part.formID

  `;

  db.query(sql, [userID], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
};

module.exports = {
  getForm
};