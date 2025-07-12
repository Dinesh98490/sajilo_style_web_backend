const Payment = require("../../models/payment")

// CREATE Payment
exports.createPayment = async (req, res) => {
  try {
    const { user_id, payment_method, price, date } = req.body;

    const payment = new Payment({
      user_id,
      payment_method,
      price,
      date: date || new Date(),
    });

    await payment.save();

    res.status(201).json({
      success: true,
      message: "Payment created successfully",
      data: payment,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error while creating payment",
      error: err.message,
    });
  }
};

// GET all payments
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("user_id", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Payments fetched successfully",
      data: payments,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching payments",
      error: err.message,
    });
  }
};

// GET single payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate("user_id", "fullName email");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment fetched successfully",
      data: payment,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching payment",
      error: err.message,
    });
  }
};

// UPDATE payment
exports.updatePayment = async (req, res) => {
  try {
    const updated = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment updated",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error while updating payment",
      error: err.message,
    });
  }
};

// DELETE payment
exports.deletePayment = async (req, res) => {
  try {
    const deleted = await Payment.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error while deleting payment",
      error: err.message,
    });
  }
};
