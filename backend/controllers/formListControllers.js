const db = require('../db');

const getForm = (req, res) => {
  const { userID } = req.body;
  const sql = `SELECT 
        form.title, 
        generatedpdf.path, 
        generatedpdf.status, 
        form.id AS formID,
        part.text AS part,
        part.id AS partID
      FROM form
      LEFT JOIN generatedpdf 
        ON form.id = generatedpdf.formID 
        AND generatedpdf.userID = ?
      JOIN part ON form.id = part.formID

  `;

  db.query(sql, [userID], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
};

module.exports = {
  getForm
};