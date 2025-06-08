-- Create seats table
CREATE TABLE IF NOT EXISTS seats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  seat_number VARCHAR(10) NOT NULL,
  place_id INT,
  package_id INT,
  is_booked BOOLEAN DEFAULT FALSE,
  price DECIMAL(10,2) NOT NULL,
  class_type ENUM('economy', 'business', 'first') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE,
  FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE,
  UNIQUE KEY unique_seat (seat_number, place_id, package_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Add price columns to places and packages
ALTER TABLE places ADD COLUMN IF NOT EXISTS base_price DECIMAL(10,2) DEFAULT 0;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS base_price DECIMAL(10,2) DEFAULT 0;

-- Update bookings table to include seat_id
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS seat_id INT NULL,
ADD FOREIGN KEY (seat_id) REFERENCES seats(id) ON DELETE SET NULL;
