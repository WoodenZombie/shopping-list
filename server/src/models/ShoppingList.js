const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  isResolved: { type: Boolean, default: false }
}, { _id: true });

const MemberSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, enum: ['owner', 'member', 'admin'], required: true }
}, { _id: false });

const ShoppingListSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ownerId: { type: String, required: true },
  members: [MemberSchema],
  items: [ItemSchema],
  isArchived: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('ShoppingList', ShoppingListSchema);
