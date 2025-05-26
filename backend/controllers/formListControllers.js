const db = require('../db');

const getForm = (req, res) => {
  const sql = `SELECT * FROM form
  `;

  db.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
};

module.exports = {
  getForm
};