require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Product = require('./models/Product');

const app = express();

app.use(express.json());
app.use(express.static('public'));

// MongoDB Atlas connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// AJAX POST route for adding product
app.post('/add-product', async (req, res) => {
  const { name } = req.body;

  try {
    const existing = await Product.findOne({ name });

    if (existing) {
      return res.status(400).json({ error: 'Product already exists' });
    }

    const product = new Product({ name });
    await product.save();
    res.json({ message: 'Product added successfully!' });

  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
