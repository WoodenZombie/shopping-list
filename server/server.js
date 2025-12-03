require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const shoppingListRoutes = require('./src/routes/shoppingList');
const memberRoutes = require('./src/routes/member');
const itemRoutes = require('./src/routes/item');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

// Update CORS to allow your specific frontend
app.use(cors({
    origin: ["https://shopping-list-lh7e.vercel.app", "http://localhost:3000"],
    credentials: true
}));

app.use(express.json());

// Simple Health Check Route (Fixes "Cannot GET /")
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Routes
app.use('/shoppingList', shoppingListRoutes);
app.use('/member', memberRoutes);
app.use('/item', itemRoutes);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

// Connect to DB
connectDB().then(() => {
    console.log('Database connected');
    if (process.env.NODE_ENV !== 'production') {
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    }
}).catch(err => {
    console.error('Database Connection Error:', err);
});

module.exports = app;