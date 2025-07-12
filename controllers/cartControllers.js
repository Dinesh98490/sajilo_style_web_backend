const Cart = require("../models/cart");

// Create a new cart
exports.createCart = async (req, res) => {
  const { product_id, total_price, total_product, discount } = req.body;
  console.log(req.body)
  try {
    
    const cart = new Cart({
      user_id: req.user._id, // Always use authenticated user's ID
      // user_id,
      product_id,
      total_price,
      total_product,
      discount,
    });

    await cart.save();

    return res.status(201).json({
      success: true,
      message: "Cart created successfully",
      data: cart,
    });
  } catch (err) {
    console.error("Error in createCart:", err);
    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation error while creating cart",
        error: err.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Server error while creating cart",
      error: err.message,
    });
  }
};

// Get all carts
exports.getCarts = async (req, res) => {
  try {
    const userId = req.user._id;
    const carts = await Cart.find({user_id: userId})
      .populate("user_id")
      .populate("product_id");

    return res.status(200).json({
      success: true,
      message: "Carts fetched successfully",
      data: carts,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error while fetching carts",
      error: err.message,
    });
  }
};

// Get a single cart by ID
exports.getCartById = async (req, res) => {
  const { id } = req.params;

  try {
    const cart = await Cart.findById(id)
      .populate("user_id", "fullName email")
      .populate("product_id", "title price");

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      data: cart,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error while fetching cart",
      error: err.message,
    });
  }
};

// Update a cart
exports.updateCart = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedCart = await Cart.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedCart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      data: updatedCart,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error while updating cart",
      error: err.message,
    });
  }
};

// Delete a cart
exports.deleteCart = async (req, res) => {
  const { id } = req.params;
  console.log("Delete request for cart item:", id);
  try {
    const deletedCart = await Cart.findByIdAndDelete(id);
    if (!deletedCart) {
      console.log("Cart item not found for deletion:", id);
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }
    console.log("Cart item deleted:", id);
    return res.status(200).json({
      success: true,
      message: "Cart deleted successfully",
    });
  } catch (err) {
    // Handle invalid ObjectId error
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: "Invalid cart ID format",
        error: err.message,
      });
    }
    console.error("Error deleting cart item:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting cart",
      error: err.message,
    });
  }
};
