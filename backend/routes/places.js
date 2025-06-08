const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const db = require('../server').db || require('mysql2').createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'travel_management'
});

// Get all popular places
router.get('/popular', (req, res) => {
  db.query('SELECT * FROM places WHERE is_popular = 1 LIMIT 10', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching places' });
    res.json(results);
  });
});

// Search places by name
router.get('/search', (req, res) => {
  const { q } = req.query;
  db.query('SELECT * FROM places WHERE name LIKE ?', [`%${q}%`], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error searching places' });
    res.json(results);
  });
});

// Get place details by id
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM places WHERE id = ?', [req.params.id], (err, results) => {
    if (err || results.length === 0) return res.status(404).json({ message: 'Place not found' });
    res.json(results[0]);
  });
});

module.exports = router;
