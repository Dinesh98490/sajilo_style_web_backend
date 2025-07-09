const Cart = require("../models/cart");

// Create a new cart
exports.createCart = async (req, res) => {
  try {
    const { user_id, cartItems, total_price, total_item, total_discount_price, discount } = req.body;

    const existingCart = await Cart.findOne({ user_id });
    if (existingCart) {
      return res.status(400).json({ message: "Cart already exists for this user." });
    }

    const newCart = new Cart({
      user_id,
      cartItems,
      total_price,
      total_item,
      total_discount_price,
      discount,
    });

    await newCart.save();
    res.status(201).json({ message: "Cart created successfully", data: newCart });
  } catch (error) {
    res.status(500).json({ message: "Failed to create cart", error });
  }
};

// Update an existing cart by user ID
exports.updateCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { cartItems, total_price, total_item, total_discount_price, discount } = req.body;

    const updatedCart = await Cart.findOneAndUpdate(
      { user_id: userId },
      { cartItems, total_price, total_item, total_discount_price, discount },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).json({ message: "Cart not found for this user." });
    }

    res.status(200).json({ message: "Cart updated successfully", data: updatedCart });
  } catch (error) {
    res.status(500).json({ message: "Failed to update cart", error });
  }
};

// Get cart by user ID
exports.getCartByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ user_id: userId }).populate("cartItems");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({ data: cart });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch cart", error });
  }
};

// Delete cart by user ID
exports.deleteCartByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const deleted = await Cart.findOneAndDelete({ user_id: userId });

    if (!deleted) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({ message: "Cart deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete cart", error });
  }
};
