// config/db.js
const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,     // e.g., 'localhost'
  user: process.env.DB_USER,     // e.g., 'root'
  password: process.env.DB_PASS, // your DB password
  database: process.env.DB_NAME  // e.g., 'your_database_name'
});

db.connect((err) => {
  if (err) {
    console.error('❌ MySQL connection error:', err.message);
  } else {
    console.log('✅ MySQL connected successfully!');
  }
});

module.exports = db;
