const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,

      },
       total_price : {
        type:Number,
        required: true,
        default: 0,
      },
      total_product : {
        type:Number,
        required: true,
        default: 0,

      },

    });

    module.exports = mongoose.model("Cart", CartSchema);
