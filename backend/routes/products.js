const fs = require('fs');
const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const pool = require('../db');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    // Hanya izinkan file gambar
    const allowed = /jpeg|jpg|png|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    if (ext) {
      cb(null, true);
    } else {
      cb(new Error('Hanya file gambar yang diizinkan (jpg, jpeg, png, webp)'));
    }
  },
});

router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = `
      SELECT 
        p.id, p.name, p.category, p.price, p.location, p.description, p.status, p.created_at,
        p.visitor_id,
        (SELECT COUNT(*) FROM likes l WHERE l.product_id = p.id) AS like_count,
        (SELECT COUNT(*) FROM product_views pv WHERE pv.product_id = p.id) AS view_count,
        (SELECT filename FROM product_photos pp WHERE pp.product_id = p.id LIMIT 1) AS first_photo
      FROM products p
    `;

    const params = [];
    if (search) {
      query += ` WHERE p.name ILIKE $1 OR p.category ILIKE $1`;
      params.push(`%${search}%`);
    }

    query += ' ORDER BY p.created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error get products:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

router.get('/my', async (req, res) => {
  try {
    const { visitorId } = req.query;
    if (!visitorId) return res.status(400).json({ message: 'Visitor ID required' });

    const result = await pool.query(
      `SELECT 
        p.id, p.name, p.category, p.price, p.location, p.description, p.status, p.created_at,
        (SELECT COUNT(*) FROM likes l WHERE l.product_id = p.id) AS like_count,
        (SELECT COUNT(*) FROM product_views pv WHERE pv.product_id = p.id) AS view_count,
        (SELECT filename FROM product_photos pp WHERE pp.product_id = p.id LIMIT 1) AS first_photo
      FROM products p
      WHERE p.visitor_id = $1
      ORDER BY p.created_at DESC`,
      [visitorId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error get my products:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { visitorId } = req.query;

    const productResult = await pool.query(
      `SELECT 
        p.id, p.name, p.category, p.price, p.location, p.description, p.status, p.created_at,
        p.visitor_id,
        (SELECT COUNT(*) FROM likes l WHERE l.product_id = p.id) AS like_count,
        (SELECT COUNT(*) FROM product_views pv WHERE pv.product_id = p.id) AS view_count
      FROM products p
      WHERE p.id = $1`,
      [id]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    const photosResult = await pool.query(
      'SELECT filename FROM product_photos WHERE product_id = $1',
      [id]
    );

    await pool.query(
      'INSERT INTO product_views (product_id, viewer_visitor_id) VALUES ($1, $2)',
      [id, visitorId || null]
    );

    const product = productResult.rows[0];
    product.photos = photosResult.rows.map((r) => r.filename);

    res.json(product);
  } catch (error) {
    console.error('Error get product detail:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

router.post('/', upload.array('photos', 5), async (req, res) => {
  try {
    const { name, category, price, location, description, visitorId } = req.body;
    const files = req.files;

    if (!name || !category || !price || !location || !visitorId) {
      return res.status(400).json({ message: 'Nama, kategori, harga, lokasi, dan visitorId harus diisi' });
    }

    const productResult = await pool.query(
      'INSERT INTO products (visitor_id, name, category, price, location, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [visitorId, name, category, parseInt(price), location, description]
    );

    const productId = productResult.rows[0].id;

    if (files && files.length > 0) {
      for (const file of files) {
        await pool.query(
          'INSERT INTO product_photos (product_id, filename) VALUES ($1, $2)',
          [productId, file.filename]
        );
      }
    }

    res.status(201).json({ message: 'Produk berhasil diupload', product: productResult.rows[0] });
  } catch (error) {
    console.error('Error upload product:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { visitorId } = req.query;

    if (!visitorId) return res.status(400).json({ message: 'Visitor ID required' });

    const photosResult = await pool.query(
      'SELECT filename FROM product_photos WHERE product_id = $1',
      [id]
    );

    const productCheck = await pool.query(
      'SELECT visitor_id FROM products WHERE id = $1',
      [id]
    );

    if (productCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    if (productCheck.rows[0].visitor_id !== visitorId) {
      return res.status(403).json({ message: 'Tidak punya akses' });
    }

    await pool.query('DELETE FROM products WHERE id = $1', [id]);

    photosResult.rows.forEach(photo => {
      const filePath = path.join(__dirname, '../uploads', photo.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); 
      }
    });

    res.json({ message: 'Produk dan file gambar berhasil dihapus' });
  } catch (error) {
    console.error('Error delete product:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

   router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, location, description, status, visitorId } = req.body;

    if (!name || !category || !price || !location || !visitorId) {
      return res.status(400).json({ message: 'Data wajib diisi (Nama, Kategori, Harga, Lokasi, visitorId)' });
    }

    const productCheck = await pool.query(
      'SELECT visitor_id FROM products WHERE id = $1',
      [id]
    );

    if (productCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    if (productCheck.rows[0].visitor_id !== visitorId) {
      return res.status(403).json({ message: 'Kamu bukan pemilik produk ini' });
    }

    const updateQuery = `
      UPDATE products 
      SET name = $1, category = $2, price = $3, location = $4, description = $5, status = $6
      WHERE id = $7 RETURNING *
    `;
    
    const result = await pool.query(updateQuery, [
      name, 
      category, 
      parseInt(price), 
      location, 
      description, 
      status || 'tersedia', 
      id
    ]);

    res.json({ message: 'Produk berhasil diperbarui', product: result.rows[0] });
  } catch (error) {
    console.error('Error Detail Backend:', error.message);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

module.exports = router;
