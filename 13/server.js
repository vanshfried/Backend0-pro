const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();

// Use this schema directly without external file
const productSchema = new mongoose.Schema({ name: String });
const Product = mongoose.model("Product", productSchema);

app.use(express.json());

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 🔥 You will write the search logic here:
app.get("/search", async (req, res) => {
  const query = req.query.query;
  try {
    const results = await Product.find({
      name: { $regex: query, $options: "i" },
    });
    res.json(results); // return as JSON array
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
});

// Optional seed route (you can remove this later)
app.post("/seed", async (req, res) => {
  await Product.deleteMany({});
  await Product.insertMany([
    { name: "iPhone 13" },
    { name: "iPhone 14 Pro" },
    { name: "Samsung Galaxy S22" },
    { name: "Samsung Galaxy S21 Ultra" },
    { name: "Redmi Note 10" },
    { name: "Redmi Note 11 Pro" },
    { name: "Google Pixel 7" },
    { name: "Google Pixel 6a" },
    { name: "Realme GT Neo 3" },
    { name: "Realme Narzo 50" },
    { name: "OnePlus 9R" },
    { name: "OnePlus Nord 2T" },
    { name: "Motorola Edge 30" },
    { name: "Poco X5 Pro" },
    { name: "Nokia G60" },
    { name: "Vivo X80" },
    { name: "Oppo Reno 8" },
    { name: "Lava Blaze 5G" },
    { name: "Asus ROG Phone 6" },
    { name: "Infinix Zero 5G" },
  ]);
  res.send("Database seeded");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(process.env.PORT || 3000, () => {
      console.log("🚀 Server running");
    });
  })
  .catch((err) => console.error("❌ MongoDB error:", err));
