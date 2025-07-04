const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

const products = [
  { id: 1, name: 'Laptop' },
  { id: 2, name: 'Mouse' },
  { id: 3, name: 'Keyboard' }
];
app.get('/products', (req, res) => {
  res.json(products);
});

app.get('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json(product);
});
app.post('/products', (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Product name is required" });
  }

  const newProduct = {
    id: products.length + 1,
    name: name
  };

  products.push(newProduct);

  res.status(201).json(newProduct); // 201 = Created
});

app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});