const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, enum: ['owner', 'member', 'admin'], required: true }
}, { _id: false });

module.exports = mongoose.model('Member', MemberSchema);
