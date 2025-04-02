const express = require("express");
const serverless = require("serverless-http");

const app = express();

console.log("Running");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ Plan A Plan backend is working!");
});

if (require.main === module) {
  app.listen(3000, () => {
    console.log("✅ Local server listening at http://localhost:3000");
  });
}

module.exports = serverless(app);
