const express = require('express');
const mysql = require('mysql2');
const app = express();
const PORT = 3000;

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'myuser',
  password: process.env.DB_PASSWORD || 'mypass',
  database: process.env.DB_NAME || 'mydb'
});

db.connect(err => {
  if (err) {
    console.error('❌ DB connection failed:', err);
    process.exit(1);
  }
  console.log('✅ Connected to MySQL database');
});

app.get('/', (req, res) => {
  res.send('Hello from Backend API!');
});

app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('DB query failed');
    }
    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
