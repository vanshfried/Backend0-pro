const express = require("express");
const app = express();
const port = 3000;
const path = require('path'); 

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.get("/api/greet", (req, res) => {
  const name = req.query.name || "user";
  res.json({ message: `Hello ${name}` });
});
app.get("/api/about", (req, res) => {
  res.json({
    project: "Backend Challenges",
    author: "Vansh",
  });
});
app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});
