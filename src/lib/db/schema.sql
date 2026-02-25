-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  vorname VARCHAR(255) NOT NULL,
  nachname VARCHAR(255) NOT NULL,
  telefon VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  leistung VARCHAR(255) NOT NULL,
  wunschtermin DATE NOT NULL,
  wunschuhrzeit VARCHAR(50) NOT NULL,
  nachricht TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, rejected, cancelled
  ip VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  confirmed_at TIMESTAMP,
  rejected_at TIMESTAMP
);

-- Blocked dates (when Lena is not available)
CREATE TABLE IF NOT EXISTS blocked_dates (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  reason VARCHAR(255), -- vacation, holiday, personal, etc
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Settings (for bot configuration)
CREATE TABLE IF NOT EXISTS settings (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_wunschtermin ON bookings(wunschtermin);
CREATE INDEX IF NOT EXISTS idx_blocked_dates_date ON blocked_dates(date);
