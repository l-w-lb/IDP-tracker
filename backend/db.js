const mysql = require('mysql2');

require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'idp_tracker_db'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('✅ Connected to MySQL!');
});

module.exports = connection;
