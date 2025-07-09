const Shipment = require("../../models/shipment");

// Create a new shipment
exports.createShipment = async (req, res) => {
  try {
    const {
      user_id,
      street_address,
      city,
      postal_code,
      district,
      province,
      country,
    } = req.body;

    const shipment = new Shipment({
      user_id,
      street_address,
      city,
      postal_code,
      district,
      province,
      country,
    });

    await shipment.save();

    res.status(201).json({
      success: true,
      message: "Shipment created successfully",
      data: shipment,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error while creating shipment",
      error: err.message,
    });
  }
};

// Get all shipments
exports.getShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find()
      .populate("user_id", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Shipments fetched successfully",
      data: shipments,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching shipments",
      error: err.message,
    });
  }
};

// Get a shipment by ID
exports.getShipmentById = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id).populate(
      "user_id",
      "fullName email"
    );

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Shipment fetched successfully",
      data: shipment,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching shipment",
      error: err.message,
    });
  }
};

// Update shipment
exports.updateShipment = async (req, res) => {
  try {
    const updatedShipment = await Shipment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedShipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Shipment updated successfully",
      data: updatedShipment,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error while updating shipment",
      error: err.message,
    });
  }
};

// Delete shipment
exports.deleteShipment = async (req, res) => {
  try {
    const deleted = await Shipment.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Shipment deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error while deleting shipment",
      error: err.message,
    });
  }
};
