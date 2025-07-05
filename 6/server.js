// server.js
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');

const app = express();
const port = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

const products = [
  { id: 1, name: 'Laptop' },
  { id: 2, name: 'Mouse' },
  { id: 3, name: 'Keyboard' }
];

// Serve HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Return all products as JSON
app.get('/products', (req, res) => {
  res.json(products);
});

// Add a product
app.post('/products', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).send("Name required");

  const newProduct = {
    id: products.length + 1,
    name
  };

  products.push(newProduct);
  res.redirect('/');
});

// Delete a product
app.delete('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).send("Product not found");
  }

  products.splice(index, 1);
  res.redirect('/');
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
