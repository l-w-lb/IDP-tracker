const db = require('../db');

const getForm = (req, res) => {
  const { userID } = req.body;
  const sql = `SELECT 
        form.title, 
        generatedpdf.path, 
        generatedpdf.status, 
        form.id
      FROM form
      LEFT JOIN generatedpdf 
        ON form.id = generatedpdf.formID 
        AND generatedpdf.userID = ?

  `;

  db.query(sql, [userID], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
};

module.exports = {
  getForm
};