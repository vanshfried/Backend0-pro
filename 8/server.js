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
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ehzasp1.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(uri)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });
  })
  .catch(err => console.error("❌ MongoDB connection error:", err.message));

// Schema
const Product = mongoose.model('Product', new mongoose.Schema({ name: String }));

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve edit.html
app.get('/edit/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'edit.html'));
});

// API: Get all products
app.get('/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// API: Get single product by ID (for edit page)
app.get('/products/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).send("Product not found");
  res.json(product);
});

// API: Add new product
app.post('/products', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).send("Name is required");
  await Product.create({ name });
  res.redirect('/');
});

// API: Update product
app.patch('/products/:id', async (req, res) => {
  const { name } = req.body;
  await Product.findByIdAndUpdate(req.params.id, { name });
  res.redirect('/');
});

app.delete('/products/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect('/');
});
