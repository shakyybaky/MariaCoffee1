const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  name: { type: String, required: true }, // customer name
  address: { type: String, required: true },
  items: [
    {
      id: String,
      name: String,
      price: Number,
      qty: Number,
    }
  ],
  total: { type: Number, required: true },
  date: { type: String, required: true },
  status: { type: String, default: "Pending" },
  username: { type: String, required: true }
});

module.exports = mongoose.model("Order", orderSchema);