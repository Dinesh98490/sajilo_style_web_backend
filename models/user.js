const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
      firstName: {
        type: String,
        required: true,
      },
      middleName: {
        type: String,
        
      },
      lastName: {
        type: String,
        required: true,
      },
      age: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },

      password: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        required: true,
        unique: true,
      },
      phone_number: {
        type: String,
        required: true,
        unique: true,
      },
      role : {
        type: String,
        default: "Customer",
        enum: ["Admin","Customer"],
    },
    },
    {
      timestamps: true,
    }
  );
  
  module.exports = mongoose.model("User", UserSchema);