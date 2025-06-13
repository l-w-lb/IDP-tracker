const db = require('../db');

const getApprovalList = (req, res) => {
  const { lead, value, leaderOf } = req.body;
  const allowedLeader = {
    division: 'account.division',
    subdivision: 'account.subdivision'
  };

  if (!allowedLeader[leaderOf]) {
    return res.status(400).json({ error: 'Invalid data' });
  }

  if (!Array.isArray(lead) || lead.length === 0) {
    return res.status(400).json({ error: 'lead ต้องเป็น array ที่ไม่ว่าง' });
  }

  const column = allowedLeader[leaderOf]; 
  const placeholders = lead.map(() => '?').join(', ');

  const sql = `
    SELECT generatedpdf.path, generatedpdf.status, form.id, form.title,
           part.text AS part, account.fullname, generatedpdf.id AS pdfId
    FROM generatedpdf
    JOIN form ON form.id = generatedpdf.formID
    JOIN part ON form.id = part.formID
    JOIN account ON account.id = generatedpdf.userID
    WHERE ${column} = ?
      AND account.lead IN (${placeholders})
    ORDER BY generatedpdf.id ASC;
  `;

  const params = [value, ...lead];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database query error' });
    }
    res.json(result);
  });
};

module.exports = {
  getApprovalList
};