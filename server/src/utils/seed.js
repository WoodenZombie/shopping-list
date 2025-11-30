require('dotenv').config();
const mongoose = require('mongoose');
const ShoppingList = require('../models/ShoppingList');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await ShoppingList.deleteMany({});
  await ShoppingList.create({
    name: 'Weekly Groceries',
    ownerId: 'user-1',
    members: [
      { userId: 'user-1', email: 'alice@example.com', role: 'owner' },
      { userId: 'user-2', email: 'bob@example.com', role: 'member' }
    ],
    items: [
      { name: 'Milk', isResolved: false },
      { name: 'Bread', isResolved: true }
    ],
    isArchived: false
  });
  console.log('Database seeded successfully');
  process.exit(0);
}

seed();