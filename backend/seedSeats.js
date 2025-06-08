const mysql = require('mysql2/promise');

async function seedSeats() {
  const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'travel_management',
    multipleStatements: true
  });

  try {
    console.log('Connected to database');
    
    // Get all places and packages
    const [places] = await db.query('SELECT id FROM places');
    const [packages] = await db.query('SELECT id FROM packages');
    
    // Define seat classes and their prices in INR
    const classes = [
      { type: 'economy', price: 2500 },
      { type: 'business', price: 7500 },
      { type: 'first', price: 15000 }
    ];
    
    // Generate seats for places
    for (const place of places) {
      for (let i = 1; i <= 5; i++) { // 5 seats per class per place
        for (const cls of classes) {
          const seatNumber = `${cls.type[0].toUpperCase()}${i}`;
          await db.query(
            'INSERT IGNORE INTO seats (seat_number, place_id, package_id, price, class_type) VALUES (?, ?, NULL, ?, ?)',
            [seatNumber, place.id, cls.price, cls.type]
          );
        }
      }
    }
    
    // Generate seats for packages
    for (const pkg of packages) {
      for (let i = 1; i <= 5; i++) { // 5 seats per class per package
        for (const cls of classes) {
          const seatNumber = `P-${pkg.id}-${cls.type[0].toUpperCase()}${i}`;
          await db.query(
            'INSERT IGNORE INTO seats (seat_number, place_id, package_id, price, class_type) VALUES (?, NULL, ?, ?, ?)',
            [seatNumber, pkg.id, cls.price, cls.type]
          );
        }
      }
    }
    
    console.log('Seats seeded successfully');
  } catch (error) {
    console.error('Error seeding seats:', error);
  } finally {
    await db.end();
    process.exit();
  }
}

seedSeats();
