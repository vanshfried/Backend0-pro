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
const Product = mongoose.model('Product', new mongoose.Schema({
  name: String,
  featured: {
    type: Boolean,
    default: false
  }
}));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/edit/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'edit.html'));
});

app.get('/products', async (req, res) => {
  const filter = req.query.featured === 'true' ? { featured: true } : {};
  const products = await Product.find(filter);
  res.json(products);
});

app.get('/products/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).send("Not found");
  res.json(product);
});

app.post('/products', async (req, res) => {
  const { name, featured } = req.body;
  await Product.create({ name, featured: featured === 'on' });
  res.redirect('/');
});

app.patch('/products/:id', async (req, res) => {
  const { name, featured } = req.body;
  await Product.findByIdAndUpdate(req.params.id, { name, featured: featured === 'on' });
  res.redirect('/');
});

app.delete('/products/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect('/');
});
