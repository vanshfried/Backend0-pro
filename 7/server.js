require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express(); // ✅ DEFINE app here
const port = process.env.PORT || 3000;

// Optional: Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// MongoDB Connection
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const dbName   = process.env.DB_NAME;

const uri = `mongodb+srv://${username}:${password}@cluster0.ehzasp1.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(uri)
  .then(() => {
    console.log("✅ Connected to MongoDB");

    // ✅ Only start server if DB connected
    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err.message);
  });
