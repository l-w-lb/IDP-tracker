const db = require('../db');

const getApprovalList = (req, res) => {
  const sql = `SELECT generatedpdf.path, generatedpdf.status, form.id, form.title 
      FROM generatedpdf
      JOIN form ON form.id = generatedpdf.formID
  `;

  db.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
};

module.exports = {
  getApprovalList
};