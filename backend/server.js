const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // set your MySQL root password
  database: 'travel_management'
});
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'travel_secret',
  resave: false,
  saveUninitialized: true
}));

// Serve static frontend
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Import routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
app.use('/api/places', require('./routes/places'));
app.use('/api/packages', require('./routes/packages'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/user', require('./routes/user'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/offers', require('./routes/offers'));
app.use('/api/admin', require('./routes/admin'));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
