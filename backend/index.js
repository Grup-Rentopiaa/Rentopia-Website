const express = require('express');
const cors = require('cors');
const path = require('path');
const productRoutes = require('./routes/products');
const likesRoutes = require('./routes/likes');
const statsRoutes = require('./routes/stats');

const app = express();
const PORT = 5000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, 
}));

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/products', productRoutes);
app.use('/api/likes', likesRoutes);
app.use('/api/stats', statsRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Rentopia API berjalan dengan baik! 🚀' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server Rentopia berjalan di http://localhost:${PORT}`);
});
