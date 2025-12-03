require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const shoppingListRoutes = require('./src/routes/shoppingList');
const memberRoutes = require('./src/routes/member');
const itemRoutes = require('./src/routes/item');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/shoppingList', shoppingListRoutes);
app.use('/member', memberRoutes);
app.use('/item', itemRoutes);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
const useMock = process.env.USE_MOCK === 'true';
const isTest = process.env.NODE_ENV === 'test' || !!process.env.JEST_WORKER_ID;

if (useMock) {
  console.log('[server] Starting in MOCK mode (no Mongo connection).');
  if (!isTest) {
    app.listen(PORT, () => console.log(`Mock server running on port ${PORT}`));
  }
} else {
  // Connect to MongoDB and start the server
  const start = async () => {
    await connectDB();
    if (!isTest) {
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    }
  };
  start();
}

// Export app for testing (Supertest) and tooling
module.exports = app;
