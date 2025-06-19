const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  price: Number,
  imageUrl: {
    type: String,
    required: true,
  },
  category: String, // optional (ring, necklace, etc.)
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
