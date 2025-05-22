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
  const formId = req.body.id;
  const sql = `SELECT topic.partID, part.text AS part, topic.text AS topic, EXAMPLE, required, question.text AS question,
    question.topicID, question.id AS questionID, topic.description AS topicDescription,
    answertype.type, listbox.text, topictype.type AS topicType, topic.typeDetail
    FROM question
    JOIN topic ON topic.id = question.topicID
    JOIN part ON part.id = topic.partID
    JOIN form ON form.id = part.formID
    JOIN answertype ON answertype.id = question.answerTypeID
    JOIN topictype ON topictype.id = topic.topicTypeID
    LEFT JOIN listbox ON question.id = listbox.questionID
    WHERE form.id = ?
    ORDER BY 
      topic.partID ASC,
      topic.id ASC,
      question.id ASC,
      listbox.id ASC;
  `;

  db.query(sql, [formId], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
};

const insertUserAnswer = (req, res) => {
  const value = req.body.value;
  console.log(value)
  const sql = `INSERT INTO useranswer (questionID, userID, text, groupInstance)
      VALUES ?;
  `;

  db.query(sql, [value], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
};

module.exports = {
  getFormTitleDescription,
  getPartTopicQuestion,
  insertUserAnswer
};