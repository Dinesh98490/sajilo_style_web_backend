const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartControllers");

router.post("/", cartController.createCart);
router.get("/", cartController.getCarts);

router.get("/:id", cartController.getCartById);
router.put("/:id", cartController.updateCart);
router.delete("/:id", cartController.deleteCart);

module.exports = router;
