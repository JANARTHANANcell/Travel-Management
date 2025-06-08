const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

const db = require('../server').db || mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'travel_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Get available seats for a place or package
router.get('/seats/available', async (req, res) => {
  try {
    const { place_id, package_id, date } = req.query;
    if (!place_id && !package_id) {
      return res.status(400).json({ message: 'Either place_id or package_id is required' });
    }

    const [seats] = await db.query(`
      SELECT s.*, 
             CASE 
               WHEN b.id IS NOT NULL THEN TRUE 
               ELSE FALSE 
             END as is_booked
      FROM seats s
      LEFT JOIN bookings b ON s.id = b.seat_id 
        AND b.start_date <= ? 
        AND b.end_date >= ?
      WHERE (s.place_id = ? OR s.package_id = ?)
        AND (b.id IS NULL OR b.id = (
          SELECT id FROM bookings 
          WHERE seat_id = s.id 
          ORDER BY created_at DESC 
          LIMIT 1
        ))
    `, [date, date, place_id || null, package_id || null]);

    res.json(seats);
  } catch (error) {
    console.error('Error fetching available seats:', error);
    res.status(500).json({ message: 'Error fetching available seats' });
  }
});

// Create booking with seat selection
router.post('/', async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    
    const { user_id, place_id, package_id, members, start_date, end_date, seat_id } = req.body;
    
    // Check if seat is available
    const [seat] = await connection.query(
      'SELECT * FROM seats WHERE id = ? AND (place_id = ? OR package_id = ?) FOR UPDATE',
      [seat_id, place_id || null, package_id || null]
    );
    
    if (!seat.length) {
      await connection.rollback();
      return res.status(400).json({ message: 'Seat not found' });
    }
    
    // Check if seat is already booked for the selected dates
    const [existingBooking] = await connection.query(
      `SELECT id FROM bookings 
       WHERE seat_id = ? 
       AND ((start_date BETWEEN ? AND ?) 
       OR (end_date BETWEEN ? AND ?) 
       OR (start_date <= ? AND end_date >= ?))`,
      [seat_id, start_date, end_date, start_date, end_date, start_date, end_date]
    );
    
    if (existingBooking.length > 0) {
      await connection.rollback();
      return res.status(400).json({ message: 'Selected seat is not available for the chosen dates' });
    }
    
    // Create booking
    const [result] = await connection.query(
      'INSERT INTO bookings (user_id, place_id, package_id, members, start_date, end_date, seat_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [user_id, place_id, package_id, members, start_date, end_date, seat_id]
    );
    
    await connection.commit();
    res.json({ 
      message: 'Booking successful',
      booking_id: result.insertId,
      total_price: (seat[0].price * members).toFixed(2)
    });
  } catch (error) {
    await connection.rollback();
    console.error('Booking error:', error);
    res.status(500).json({ message: 'Booking failed', error: error.message });
  } finally {
    connection.release();
  }
});

// Get bookings for user with seat details
router.get('/user/:user_id', async (req, res) => {
  try {
    const [bookings] = await db.query(`
      SELECT b.*, 
             s.seat_number, 
             s.class_type,
             s.price as seat_price,
             p.name as place_name,
             pkg.name as package_name
      FROM bookings b
      LEFT JOIN seats s ON b.seat_id = s.id
      LEFT JOIN places p ON b.place_id = p.id
      LEFT JOIN packages pkg ON b.package_id = pkg.id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `, [req.params.user_id]);
    
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

module.exports = router;
