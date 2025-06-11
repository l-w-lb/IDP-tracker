const db = require('../db');

const getFormTitleDescription = (req, res) => {
  const formId = req.body.id;
  const sql = `SELECT *
    FROM form
    WHERE form.id = ?;
  `;

  db.query(sql, [formId], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
};

const getPartTopicQuestion = (req, res) => {
  const { userID, formID, partID } = req.body;
  const sql = `SELECT 
        topic.partID, 
        part.text AS part, 
        topic.text AS topic, 
        EXAMPLE, 
        required, 
        question.text AS question,
        question.topicID, 
        question.id AS questionID, 
        question.questionDetail,
        topic.description AS topicDescription,
        answertype.type, 
        choice.text AS choiceText, 
        choice.id AS choiceID,
        topictype.type AS topicType, 
        topic.typeDetail, 
        useranswer.text AS userAnswer,
        useranswer.groupInstance,
        useranswer.subInstance,
        useranswer.id AS answerID
      FROM question
      JOIN topic ON topic.id = question.topicID
      JOIN part ON part.id = topic.partID
      JOIN form ON form.id = part.formID
      JOIN answertype ON answertype.id = question.answerTypeID
      JOIN topictype ON topictype.id = topic.topicTypeID
      LEFT JOIN choice ON question.id = choice.questionID
      LEFT JOIN useranswer 
        ON question.id = useranswer.questionID
        AND useranswer.accountID = ?
      WHERE form.id = ?
        AND part.id <= ?
      ORDER BY 
        topic.partID ASC,
        topic.id ASC,
        question.id ASC,
        choice.id ASC;

  `;

  db.query(sql, [userID, formID, partID], (err, result) => {
    // console.log(res)
    if (err) throw err;
    res.json(result);
  });
};

const insertUserAnswer = (req, res) => {
  const value = req.body.value;
  const sql = `INSERT INTO useranswer (questionID, accountID, groupInstance, subInstance, text)
      VALUES ?
      ON DUPLICATE KEY UPDATE
        text = VALUES(text);
  `;

  db.query(sql, [value], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
};

const getUserAnswer = (req, res) => {
  const formID = req.body.formID;
  const accountID = req.body.accountID;
  const sql = `SELECT useranswer.text, useranswer.questionID, useranswer.groupInstance, 
  useranswer.subInstance
      FROM useranswer
      JOIN question ON question.id = useranswer.questionID
      JOIN topic ON topic.id = question.topicID
      JOIN part ON part.id = topic.partID
      JOIN form ON form.id = part.formID
      WHERE useranswer.accountID = ?
      AND form.id = ?
      ORDER BY 
      	question.id ASC,
      	useranswer.groupInstance ASC
  `;
  console.log(formID,accountID)
  
  db.query(sql, [accountID, formID], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
};

const getSpecialQuestion = (req, res) => {
  const formId = req.body.formID;
  const sql = `SELECT specialquestion.id, specialquestion.column, specialquestion.questionID,
    specialquestion.table
      FROM specialquestion
      JOIN question ON question.id = specialquestion.questionID
      JOIN topic ON topic.id = question.topicID
      JOIN part ON part.id = topic.partID
      JOIN form ON form.id = part.formID
      WHERE form.id = ?
  `;

  db.query(sql, [formId], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
};

const insertSpecialAnswer = (req, res) => {
  const { table, value, column } = req.body;
  const allowedTables = ['account'];
  const allowedColumns = ['id', 'fullname', 'personnel', 'position', 'level', 'lead', 'division', 'subdivision'];

  if (!allowedTables.includes(table) || !allowedColumns.includes(column)) {
    return res.status(400).json({ error: 'Invalid table or column name' });
  }

  const sql = `
    INSERT INTO \`${table}\` (id, \`${column}\`)
    VALUES ?
    ON DUPLICATE KEY UPDATE
      \`${column}\` = VALUES(\`${column}\`)
  `;
  console.log(table, value, column)

  db.query(sql, [value], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
}

module.exports = {
  getFormTitleDescription,
  getPartTopicQuestion,
  insertUserAnswer,
  getUserAnswer,
  getSpecialQuestion,
  insertSpecialAnswer
};