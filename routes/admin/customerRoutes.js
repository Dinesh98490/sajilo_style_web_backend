const express = require("express");
const router = express.Router();
const {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} = require("../../controllers/admin/customerController");

const upload = require("../../middlewares/fileUpload");

// Pcreate a pist for the customers routes 
router.post(
  "/",
  upload.single("image"),
  createCustomer
);

// Get - all by customer
router.get("/", getCustomers);

// GET - get single customer
router.get("/:id", getCustomerById);

// PUT - update customer
router.put("/:id", upload.single("image"), updateCustomer);

// DELETE - delete customer
router.delete("/:id", deleteCustomer);

module.exports = router;
