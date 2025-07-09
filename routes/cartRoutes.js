const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartControllers");

// Create a new cart
router.post("/cart", cartController.createCart);

// Update an existing cart by user ID
router.put("/cart/:userId", cartController.updateCart);

// Get cart by user ID
router.get("/cart/:userId", cartController.getCartByUser);

// Delete cart by user ID
router.delete("/cart/:userId", cartController.deleteCartByUser);

module.exports = router;
