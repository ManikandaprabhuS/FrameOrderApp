const mongoose = require('mongoose');

const frameSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String},
  sizes: [String], // e.g., ["8x10", "12x16"]
  colors: [String], // e.g., ["Black", "White", "Brown"]
  material: { type: String, required: true }, // e.g., "Wood", "Metal"
  price: { type: Number, required: true },
  videoUrl: { type: String }, // Optional video preview,
  outOfStock: Boolean 
}, { timestamps: true });

module.exports = mongoose.model('Frame', frameSchema);
