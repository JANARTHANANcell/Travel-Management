const fs = require('fs');
const mysql = require('mysql2/promise');
const path = require('path');

async function runMigration() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    multipleStatements: true
  });

  try {
    // Read the SQL file
    const sql = fs.readFileSync(
      path.join(__dirname, 'migrations/001_add_seats_table.sql'), 
      'utf8'
    );
    
    console.log('Running migration...');
    await connection.query('USE travel_management');
    await connection.query(sql);
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Error running migration:', error);
  } finally {
    await connection.end();
    process.exit();
  }
}

runMigration();
