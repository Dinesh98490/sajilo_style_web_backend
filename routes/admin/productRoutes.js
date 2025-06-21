const express = require("express");
const router = express.Router();
const productController = require("../../controllers/admin/productController");
const upload = require("../../middlewares/fileUpload");

// POST - create product with image
router.post(
  "/",
  upload.single("image"),
  productController.createProduct
);

// GET, UPDATE, DELETE routes
router.get("/", productController.getProducts);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
