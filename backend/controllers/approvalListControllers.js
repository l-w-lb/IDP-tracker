const db = require('../db');

const getApprovalList = (req, res) => {
  const { lead, value, leaderOf, status, hr } = req.body;
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

  const sql = hr ? `
    SELECT generatedpdf.path, form.id, form.title, generatedpdf.date,
           part.text AS part, account.fullname, generatedpdf.id AS pdfId, form.title
    FROM generatedpdf
    JOIN form ON form.id = generatedpdf.formID
    JOIN part ON part.id = generatedpdf.partID
    JOIN account ON account.id = generatedpdf.userID
    WHERE generatedpdf.status = ?
    ORDER BY generatedpdf.id ASC;
  ` : `
    SELECT generatedpdf.path, form.id, form.title, generatedpdf.date,
           part.text AS part, account.fullname, generatedpdf.id AS pdfId, form.title
    FROM generatedpdf
    JOIN form ON form.id = generatedpdf.formID
    JOIN part ON part.id = generatedpdf.partID
    JOIN account ON account.id = generatedpdf.userID
    WHERE ${column} = ?
      AND account.lead IN (${placeholders})
      AND generatedpdf.status = ?
    ORDER BY generatedpdf.id ASC;
  `;

  const params = hr ? [status] : [value, ...lead, status];
  console.log(params, sql)

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