const wishlistRepo = require('../repositories/wishlistRepository');

const toggleWishlist = async (req, res) => {
  try {
    const { user_id, product_id, action } = req.body;

    if (action === 'add') {
      await wishlistRepo.add(user_id, product_id);
    } else {
      await wishlistRepo.remove(user_id, product_id);
    }

    res.json({ success: true, message: `Wishlist berhasil di-${action}` });
  } catch (err) {
    res.status(500).json({ message: 'Gagal update wishlist' });
  }
};

module.exports = { toggleWishlist };
