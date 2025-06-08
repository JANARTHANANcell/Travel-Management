const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const db = require('../server').db || require('mysql2').createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'travel_management'
});

// Get all offers (places with offers)
router.get('/', (req, res) => {
  db.query('SELECT * FROM places WHERE description LIKE "%offer%"', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching offers' });
    res.json(results);
  });
});

module.exports = router;
