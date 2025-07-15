const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();

// Use this schema directly without external file
const productSchema = new mongoose.Schema({ name: String });
const Product = mongoose.model('Product', productSchema);

app.use(express.json());

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 🔥 You will write the search logic here:
app.get('/search', async (req, res) => {
  // implement logic here
});

// Optional seed route (you can remove this later)
app.post('/seed', async (req, res) => {
  await Product.deleteMany({});
  await Product.insertMany([
    { name: 'iPhone 13' },
    { name: 'iPhone 14 Pro' },
    { name: 'Samsung Galaxy S22' },
    { name: 'Redmi Note 10' },
    { name: 'Google Pixel 7' },
    { name: 'Realme GT Neo' },
  ]);
  res.send('Database seeded');
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(process.env.PORT || 3000, () => {
      console.log('🚀 Server running');
    });
  })
  .catch(err => console.error('❌ MongoDB error:', err));
