require('dotenv').config();
const mongoose = require('mongoose');
const ShoppingList = require('../models/ShoppingList');
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const count = await ShoppingList.countDocuments();
    const lists = await ShoppingList.find();
    console.log('ShoppingList documents count:', count);
    console.log('Lists:', lists.map(l => ({ id: l._id, name: l.name, ownerId: l.ownerId, members: l.members.length })));
    process.exit(0);
  } catch (e) {
    console.error('Debug listCount error:', e);
    process.exit(1);
  }
})();