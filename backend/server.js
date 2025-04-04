require('dotenv').config();
const {testDatabaseConnection } = require('./src/config/db');
const app = require('./src/app');

const PORT = process.env.PORT || 7788;

const startServer = async () => {
  try {
      await testDatabaseConnection();
      app.listen(PORT, () => {
          console.log(`✅ Server running on http://localhost:${PORT}`);
      });
  } catch (error) {
      console.error("❌ Server failed to start:", error);
  }
};

// Start the server
startServer();