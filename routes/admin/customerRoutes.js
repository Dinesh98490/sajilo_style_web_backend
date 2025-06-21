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

// POST - create customer
router.post(
  "/",
  upload.single("image"),
  createCustomer
);

// GET - get all customers
router.get("/", getCustomers);

// GET - get single customer
router.get("/:id", getCustomerById);

// PUT - update customer
router.put("/:id", upload.single("image"), updateCustomer);

// DELETE - delete customer
router.delete("/:id", deleteCustomer);

module.exports = router;
