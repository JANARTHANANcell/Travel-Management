-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  is_blocked BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admins table (for extensibility, but hardcoded login allowed)
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- Places table
CREATE TABLE IF NOT EXISTS places (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image_url VARCHAR(255),
  is_popular BOOLEAN DEFAULT FALSE
);

-- Packages table
CREATE TABLE IF NOT EXISTS packages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  days INT,
  cost DECIMAL(10,2),
  image_url VARCHAR(255),
  is_popular BOOLEAN DEFAULT FALSE
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  place_id INT,
  package_id INT,
  members INT,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (place_id) REFERENCES places(id),
  FOREIGN KEY (package_id) REFERENCES packages(id)
);

-- Feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Sample Data: Popular Indian Places
INSERT INTO places (name, description, image_url, is_popular) VALUES
('Goa', 'Famous for its beaches, nightlife, and vibrant culture.', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb', 1),
('Manali', 'A beautiful hill station in Himachal Pradesh, known for snow and adventure sports.', 'https://images.unsplash.com/photo-1464013778555-8e723c2f01f8', 1),
('Jaipur', 'The Pink City, rich in culture and history.', 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29', 1),
('Kerala', 'God’s Own Country, famous for backwaters and greenery.', 'https://images.unsplash.com/photo-1518684079-3c830dcef090', 1),
('Andaman', 'Tropical islands with crystal clear water and coral reefs.', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', 1),
('Shimla', 'Queen of Hills, popular for colonial architecture and views.', 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca', 1),
('Ooty', 'A charming hill station in Tamil Nadu, known for tea gardens.', 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99', 1),
('Rishikesh', 'Yoga capital of the world, famous for river rafting.', 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368', 1),
('Ladakh', 'Land of high passes, famous for its landscapes and monasteries.', 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429', 1),
('Agra', 'Home to the Taj Mahal, one of the wonders of the world.', 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92', 1);

-- Sample Data: Popular Indian Packages
INSERT INTO packages (name, description, days, cost, image_url, is_popular) VALUES
('Goa Beach Holiday', 'Enjoy the sun, sand, and sea in Goa with this 4-day holiday package.', 4, 12000, 'https://images.unsplash.com/photo-1506744038136-46273834b3fb', 1),
('Kerala Backwaters', 'Relax on a houseboat and explore the serene backwaters of Kerala for 5 days.', 5, 18000, 'https://images.unsplash.com/photo-1518684079-3c830dcef090', 1),
('Golden Triangle', 'Visit Delhi, Agra, and Jaipur in this classic 6-day tour.', 6, 25000, 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29', 1),
('Andaman Honeymoon', 'A romantic 5-day getaway to the Andaman Islands.', 5, 30000, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', 1),
('Manali Adventure', '4 days of adventure sports and sightseeing in Manali.', 4, 15000, 'https://images.unsplash.com/photo-1464013778555-8e723c2f01f8', 1),
('Ladakh Road Trip', '7 days of high-altitude adventure in Ladakh.', 7, 35000, 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429', 1),
('Ooty & Mysore', 'Explore the hills of Ooty and the palaces of Mysore in 3 days.', 3, 10000, 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99', 1),
('Shimla-Kullu-Manali', '5-day trip covering three popular hill stations.', 5, 17000, 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca', 1),
('Rishikesh Yoga Retreat', 'A spiritual 3-day yoga retreat in Rishikesh.', 3, 8000, 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368', 1),
('Agra & Taj Mahal', '2 days exploring Agra and the Taj Mahal.', 2, 7000, 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92', 1);
