const express = require("express");
const router = express.Router();
const {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
} = require("../../controllers/admin/paymentController");

// POST - Create payment
router.post("/", createPayment);

// GET - All payments
router.get("/", getPayments);

// GET - Single payment by ID
router.get("/:id", getPaymentById);

// PUT - Update payment
router.put("/:id", updatePayment);

// DELETE - Delete payment
router.delete("/:id", deletePayment);

module.exports = router;
