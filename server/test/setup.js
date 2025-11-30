require("dotenv").config();
const app = require("../server");
const mongoose = require("mongoose");
const connectDB = require("../config/db");

// Ensure single DB connection across test files.
let connectionPromise;
if (!global.__DB_CONNECTED__) {
  connectionPromise = connectDB();
  global.__DB_CONNECTED__ = true;
} else {
  connectionPromise = Promise.resolve();
}

module.exports = { app, mongoose, connectionPromise };