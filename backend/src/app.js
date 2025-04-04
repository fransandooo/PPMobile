// backend/src/app.js
const express = require("express");
const cors = require("cors");

const app = express();

// Use CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Example route
app.get("/", (req, res) => {
  res.send("✅ Plan A Plan backend running on Render!");
});

module.exports = app;
