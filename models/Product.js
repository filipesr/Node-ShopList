const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true, required: true },
    title: { type: String, required: true, unique: true },
    img: { type: String, required: true },
    category: { type: String, required: true },
    size: { type: String, required: true },
    price: { type: Number },
    prices: [{ 
      price: { type: Number, required: true },
      date:  { type: Date, default: mongoose.now },
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
