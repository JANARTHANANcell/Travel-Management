const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const db = require('../server').db || require('mysql2').createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'travel_management'
});

// Submit feedback
router.post('/', (req, res) => {
  const { user_id, message } = req.body;
  db.query('INSERT INTO feedback (user_id, message) VALUES (?, ?)', [user_id, message], (err) => {
    if (err) return res.status(500).json({ message: 'Feedback failed' });
    res.json({ message: 'Feedback submitted' });
  });
});

module.exports = router;
