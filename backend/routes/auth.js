const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');

// MySQL connection
const db = require('../server').db || require('mysql2').createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'travel_management'
});

// User Signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
  const hash = await bcrypt.hash(password, 10);
  db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hash], (err) => {
    if (err) return res.status(400).json({ message: 'Email already exists' });
    res.json({ message: 'Signup successful' });
  });
});

// User Signin
router.post('/signin', (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err || results.length === 0) return res.status(400).json({ message: 'Invalid credentials' });
    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    req.session.userId = user.id;
    res.json({ message: 'Signin successful', user: { id: user.id, name: user.name, email: user.email } });
  });
});

// Admin Login (hardcoded credentials)
router.post('/admin', (req, res) => {
  const { username, password } = req.body;
  if (username === 'jana' && password === '1234') {
    req.session.admin = true;
    res.json({ message: 'Admin login successful' });
  } else {
    res.status(401).json({ message: 'Invalid admin credentials' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out' });
});

module.exports = router;
