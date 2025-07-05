require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// MongoDB connection
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const dbName   = process.env.DB_NAME;

const uri = `mongodb+srv://${username}:${password}@cluster0.ehzasp1.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(uri)
  .then(() => {
    console.log("✅ Connected to MongoDB");

    // Start server only after DB connection
    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });
  })
  .catch(err => console.error("❌ MongoDB connection error:", err.message));

// Mongoose schema
const Product = mongoose.model('Product', new mongoose.Schema({
  name: String
}));

// Serve HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Get all products
app.get('/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Add a product
app.post('/products', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).send("Name is required");

  await Product.create({ name });
  res.redirect('/');
});

// Delete a product
app.delete('/products/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect('/');
});
