CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  price_per_day NUMERIC(10, 2) NOT NULL,
  category_id INT REFERENCES categories(id),
  owner_id INT REFERENCES users(id),
  location VARCHAR(200),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  image_url TEXT,
  rating NUMERIC(3,1) DEFAULT 0,
  rating_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS saved_keywords (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  keyword VARCHAR(200) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  keyword VARCHAR(200) NOT NULL,
  item_id INT REFERENCES items(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO categories (name) VALUES
  ('Elektronik'),
  ('Kendaraan'),
  ('Pakaian'),
  ('Peralatan Rumah'),
  ('Olahraga'),
  ('Kamera & Fotografi'),
  ('Alat Musik'),
  ('Buku & Pendidikan'),
  ('Bayi & Anak'),
  ('Lainnya')
ON CONFLICT DO NOTHING;

INSERT INTO users (name, email, password, address, latitude, longitude) VALUES
  ('Admin Rentopia', 'admin@rentopia.com', '$2a$10$2HhM/Y9p5M.6R8Q/W3gW..W2cZz3/S1XU4fXYH/EaNfS.U9oU7eOq', 'Jakarta Pusat', -6.2088, 106.8456)
ON CONFLICT DO NOTHING;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM items LIMIT 1) THEN
    INSERT INTO items (title, description, price_per_day, category_id, owner_id, location, latitude, longitude, image_url, rating, rating_count) VALUES
      ('Kamera Sony Alpha A7III',       'Kamera mirrorless full frame, cocok untuk foto & video profesional', 250000, 6, 1, 'Jakarta Selatan', -6.2607, 106.8106, '/images/kamera.jpg',        4.8, 124),
      ('Drone DJI Mavic 3',             'Drone sinematik 4K dengan obstacle sensing, sewa per hari',          350000, 6, 1, 'Bandung',          -6.9175, 107.6191, '/images/drone.jpg',        4.7, 89),
      ('Motor Honda Beat 2022',         'Motor matic terawat, bensin tanggung sendiri',                       100000, 2, 1, 'Jakarta Timur',    -6.2251, 106.9004, '/images/motor.jpg',        4.5, 210),
      ('Laptop MacBook Pro M2',         'MacBook Pro 14 inch M2, RAM 16GB, SSD 512GB',                        300000, 1, 1, 'Jakarta Pusat',    -6.2088, 106.8456, '/images/laptop.jpg',     4.9, 67),
      ('Proyektor Epson EB-X41',        'Proyektor 3600 lumens, cocok untuk presentasi & nonton bareng',      150000, 1, 1, 'Surabaya',         -7.2575, 112.7521, '/images/proyektor.jpg',        4.3, 45),
      ('Tenda Camping 4 Orang',         'Tenda waterproof kapasitas 4 orang, lengkap dengan matras',          80000,  5, 1, 'Bogor',            -6.5971, 106.8060, '/images/tenda.jpg',   4.6, 78),
      ('Set Gitar Akustik Yamaha F310', 'Gitar akustik Yamaha F310 dengan capo dan strap',                    75000,  7, 1, 'Yogyakarta',       -7.7956, 110.3695, '/images/gitar.jpg', 4.4, 33),
      ('PlayStation 5 + 2 Controller', 'PS5 disc edition + 2 controller, bisa minta game pilihan',           200000, 1, 1, 'Bekasi',           -6.2383, 106.9756, '/images/ps5.jpg',     4.7, 156),
      ('Baju Adat Jawa Pria',           'Setelan beskap lengkap ukuran M-L, cocok untuk acara pernikahan',    120000, 3, 1, 'Solo',             -7.5750, 110.8243, '/images/baju.jpg', 4.2, 28),
      ('Stroller Bayi Joie',            'Stroller lipat ringan, cocok untuk bayi 0-3 tahun',                  50000,  9, 1, 'Tangerang',        -6.1781, 106.6298, '/images/stroller.jpg',     4.5, 91),
      ('Speaker Bluetooth JBL Xtreme 3','Speaker outdoor waterproof, baterai 15 jam',                         90000,  1, 1, 'Depok',            -6.4025, 106.7942, '/images/speaker.jpg',  4.6, 114),
      ('Stand Up Paddleboard 10ft',     'Papan SUP ukuran 10ft lengkap dengan dayung dan pompa',              180000, 5, 1, 'Bali',             -8.6705, 115.2126, '/images/paddleboard.jpg', 4.8, 52);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='items' AND column_name='rating'
  ) THEN
    ALTER TABLE items ADD COLUMN rating NUMERIC(3,1) DEFAULT 0;
    ALTER TABLE items ADD COLUMN rating_count INT DEFAULT 0;
  END IF;
END
$$;
