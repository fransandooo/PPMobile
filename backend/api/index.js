// PPMobile/backend/api/index.js
const express = require("express");
const serverless = require("serverless-http");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ Plan A Plan backend is working!");
});

module.exports = serverless(app);
