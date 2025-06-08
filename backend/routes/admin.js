const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const db = require('../server').db || require('mysql2').createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'travel_management'
});

// Get all users
router.get('/users', (req, res) => {
  db.query('SELECT id, name, email, created_at FROM users', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching users' });
    res.json(results);
  });
});

// Get all bookings
router.get('/bookings', (req, res) => {
  db.query('SELECT * FROM bookings', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching bookings' });
    res.json(results);
  });
});

// Delete user
router.delete('/users/:id', (req, res) => {
  db.query('DELETE FROM users WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: 'Error deleting user' });
    res.json({ message: 'User deleted' });
  });
});

// Block or unblock user
router.post('/users/:id/block', (req, res) => {
  const { block } = req.body; // block: true/false
  db.query('UPDATE users SET is_blocked = ? WHERE id = ?', [block ? 1 : 0, req.params.id], (err) => {
    if (err) return res.status(500).json({ message: 'Error updating user' });
    res.json({ message: block ? 'User blocked' : 'User unblocked' });
  });
});

// Delete booking
router.delete('/bookings/:id', (req, res) => {
  db.query('DELETE FROM bookings WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: 'Error deleting booking' });
    res.json({ message: 'Booking deleted' });
  });
});

module.exports = router;
