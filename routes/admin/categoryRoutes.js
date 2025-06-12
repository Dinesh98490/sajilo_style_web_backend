const express = require("express");

const router = express.Router();

const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../../controllers/admin/categoryControllers")

const {
  authenticateUser,
  isAdmin,
} = require("../../middlewares/authorizedUser");

router.post("/create", authenticateUser, isAdmin, createCategory);

router.get("/", authenticateUser, isAdmin, getAllCategories);

router.get("/:id", authenticateUser, isAdmin, getCategoryById);

router.put("/:id", authenticateUser, isAdmin, updateCategory);

router.delete("/:id", authenticateUser, isAdmin, deleteCategory);

module.exports = router;
