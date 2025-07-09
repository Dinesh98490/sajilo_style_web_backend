const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} = require("../../controllers/admin/orderController");

// POST - Create order
router.post("/", createOrder);

// GET - All orders
router.get("/", getOrders);

// GET - Single order by ID
router.get("/:id", getOrderById);

// PUT - Update order
router.put("/:id", updateOrder);

// DELETE - Delete order
router.delete("/:id", deleteOrder);

module.exports = router;
