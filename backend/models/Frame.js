const mongoose = require('mongoose');

const frameSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrls: [String],
  centerImage: {
  type: String,
  required: true // or false if optional
},
  colors: [String], // e.g., ["Black", "White", "Brown"]
  material: { type: String, required: true }, // e.g., "Wood", "Metal"
  pricing: [
    {
      size: { type: String, required: true },
      price: { type: Number, required: true }
    }
  ],
  videoUrl: { type: String }, // Optional video preview,
  outOfStock: Boolean
}, { timestamps: true });

module.exports = mongoose.model('Frame', frameSchema);
