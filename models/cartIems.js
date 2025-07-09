const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
    card_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart",
        required: true,
      },
       product_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      size : {
        type:Number,
        required: true,
        
      },
      quantity : {
        type:Number,
        required: true,
        default: 1,

      },
      price: {
        type: Number,
        required: true,
      },

      discounted_price: {
        type: Number,
        required: true,
      },

      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

        
     
    });

    module.exports = mongoose.model("CartItem", CartItemSchema);
