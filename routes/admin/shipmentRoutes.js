const express = require("express");
const router = express.Router();

const {
  createShipment,
  getShipments,
  getShipmentById,
  updateShipment,
  deleteShipment,
} = require("../../controllers/admin/shipmentController");

// POST 
router.post("/", createShipment);

//Get 

router.get("/", getShipments);

// Get by id
router.get("/:id", getShipmentById);

// Put by id
router.put("/:id", updateShipment);

// delete by ID
router.delete("/:id", deleteShipment);

module.exports = router;
