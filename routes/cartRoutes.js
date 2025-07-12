const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartControllers");
const {authenticateUser} = require("../middlewares/authMiddleware")

console.log('Cart routes loaded');

router.post("/", authenticateUser,  cartController.createCart);
router.get("/", authenticateUser, cartController.getCarts);

router.get("/:id", authenticateUser, cartController.getCartById);
router.put("/:id", authenticateUser, cartController.updateCart);
router.delete("/:id", authenticateUser, cartController.deleteCart);

module.exports = router;

