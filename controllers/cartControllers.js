const Cart = require("../models/cart");

// Create a new cart
exports.createCart = async (req, res) => {
  try {
    const { user_id, product_id, total_price, total_product, discount } = req.body;

    const cart = new Cart({
      user_id,
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
    const carts = await Cart.find()
      .populate("user_id", "fullName email")
      .populate("product_id", "title price ")
      .sort({ createdAt: -1 });

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

  try {
    const deletedCart = await Cart.findByIdAndDelete(id);

    if (!deletedCart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cart deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error while deleting cart",
      error: err.message,
    });
  }
};
