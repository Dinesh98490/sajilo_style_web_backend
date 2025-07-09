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

// get, update, delete routes 
router.get("/", productController.getProducts);

router.get("/:id", productController.getProductById);

//get- get single customer
router.put("/:id", upload.single("image"),productController.updateProduct);

router.delete("/:id", productController.deleteProduct);

module.exports = router;


// Create product (upload multiple images)




// router.post("/", upload.single("image"), productController.createProduct);

// // Get all products
// router.get("/", productController.getAllProduct);

// // Get product by ID
// router.get("/:id", productController.getProductById);

// // Update product (optionally upload new images)
// router.put("/:id", upload.array("image", 10), productController.updateProduct);

// // Delete product
// router.delete("/:id", productController.deleteProduct);

// module.exports = router;
