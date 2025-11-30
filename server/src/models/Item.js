const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  isResolved: { type: Boolean, default: false }
}, { _id: true });

module.exports = mongoose.model('Item', ItemSchema);
