const db = require('../db');

const getApprovalList = (req, res) => {
  const sql = `SELECT * FROM generatedpdf
  `;

  db.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
};

module.exports = {
  getApprovalList
};