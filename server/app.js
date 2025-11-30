const express = require("express");
const cors = require("cors");
const shoppingListRoutes = require("./src/routes/shoppingList");
const memberRoutes = require("./src/routes/member");
const itemRoutes = require("./src/routes/item");
const errorHandler = require("./src/middleware/errorHandler");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/shoppingList", shoppingListRoutes);
app.use("/member", memberRoutes);
app.use("/item", itemRoutes);

// Error handler
app.use(errorHandler);

module.exports = app;
