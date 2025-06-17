// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed
  outOfDeliveryStatus: {
    type: String,
    default: 'pending', // Updated by admin
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
