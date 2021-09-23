const mongoose = require("mongoose");

const ShopListSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    pending: [{ product: { type: String, required: true } }],
    checked: [{ product: { type: String, required: true } }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ShopList", ShopListSchema);
