require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// MongoDB Connect
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ehzasp1.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(() => {
    console.log("✅ Connected to DB");
    app.listen(port, () => console.log(`🚀 http://localhost:${port}`));
  })
  .catch((err) => console.error("❌ DB error:", err));

// Schema
const Product = mongoose.model(
  "Product",
  new mongoose.Schema({
    name: String,
    quantity: Number,
  })
);

// Serve HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.post("/products", async (req, res) => {
  const { name, quantity } = req.body;
  await Product.create({ name, quantity });
  res.redirect("/");
});

app.patch("/products/:id", async (req, res) => {
  const id = req.params.id;
  const { quantity } = req.body;
  await Product.findByIdAndUpdate(id, { quantity });
  res.redirect("/");
});
app.delete("/products/:id", async (req, res) => {
    await Product.findByIdAndDelete(req.params.id)
    res.redirect("/");
}
)
// TODO: You will now write:
// POST /products     → add product
// PATCH /products/:id → update quantity
// GET /products      → return all products
// DELETE /products/:id → delete product
