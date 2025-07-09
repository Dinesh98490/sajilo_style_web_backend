const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      cartItems : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CartItems',
        required: true,
      }],
      total_price : {
        type:Number,
        required: true,
        default: 0,
      },
      total_item : {
        type:Number,
        required: true,
        default: 0,

      },
      total_discount_price: {
        type: Number,
        required: true,
        default:0
      },
      discount: {
        type: Number,
        required: true,
        default:0

      },

    });

    module.exports = mongoose.model("Cart", CartSchema);
