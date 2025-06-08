const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const db = require('../server').db || require('mysql2').createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'travel_management'
});

// Get user details
router.get('/:id', (req, res) => {
  db.query('SELECT id, name, email, created_at FROM users WHERE id = ?', [req.params.id], (err, results) => {
    if (err || results.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(results[0]);
  });
});

module.exports = router;
