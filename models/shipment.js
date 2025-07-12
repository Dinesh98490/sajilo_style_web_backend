const mongoose = require("mongoose");

const ShipmentSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    street_address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    postal_code: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
      default: "Nepal", 
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Shipment", ShipmentSchema);
