const db = require('../db');

const getForm = (req, res) => {
  const sql = `SELECT form.title, generatedpdf.path, generatedpdf.status, form.id
      FROM generatedpdf
      RIGHT JOIN form ON form.id = generatedpdf.formID
      WHERE generatedpdf.userID = 3
  `;

  db.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
};

module.exports = {
  getForm
};