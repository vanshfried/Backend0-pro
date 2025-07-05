// server.js
const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const products = [
  { id: 1, name: "Laptop" },
  { id: 2, name: "Mouse" },
  { id: 3, name: "Keyboard" },
];

// Serve the HTML form
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Return all products
app.get("/products", (req, res) => {
  res.json(products);
});

// Add a product
app.post("/products", (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Product name is required" });
  }

  const newProduct = {
    id: products.length + 1,
    name
  };

  products.push(newProduct);

  res.send(`<h2>Product "${name}" added! <a href="/">Go Back</a></h2>`);
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
