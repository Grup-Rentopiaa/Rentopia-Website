const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'http://localhost:5174',
  credentials: true
}));
app.use(express.json());

app.use('/api/products', require('./routes/products'));
app.use('/api/wishlist', require('./routes/wishlist'));

app.listen(3000, () => {
  console.log('Server Express Rentopia di http://localhost:3000');
});
