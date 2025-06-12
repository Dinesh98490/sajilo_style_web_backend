const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  imageUrl: {
    type: String, // URL or local path to the image
    default: "",  // optional default
  },
}, {
  timestamps: true, 
});

module.exports = mongoose.model("Category", CategorySchema);
