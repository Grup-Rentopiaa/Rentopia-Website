const productRepo = require('../repositories/productRepository');

const getAllProducts = async (req, res) => {
  try {
    const products = await productRepo.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Gagal ambil produk' });
  }
};

const getHotDeals = async (req, res) => {
  try {
    const products = await productRepo.findHotDeals();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Gagal ambil hot deals' });
  }
};

module.exports = { getAllProducts, getHotDeals };
