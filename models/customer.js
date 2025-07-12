const mongoose = require("mongoose");


// create a customer models 
const CustomerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("Customer", CustomerSchema);
