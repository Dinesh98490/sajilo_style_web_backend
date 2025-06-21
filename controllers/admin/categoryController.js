const Category = require("../../models/category");

// Create a new category
exports.createCategory = async (req, res) => {
  const { title, desc } = req.body;

  try {
    const category = new Category({ title, desc });
    await category.save();
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error while creating category",
      error: err.message,
    });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching categories",
      error: err.message,
    });
  }
};

// Get single category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ success: false, message: "Category not found" });
    res.status(200).json({
      success: true,
      message: "Category fetched successfully",
      data: category,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching category",
      error: err.message,
    });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedCategory)
      return res.status(404).json({ success: false, message: "Category not found" });

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error while updating category",
      error: err.message,
    });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);

    if (!deletedCategory)
      return res.status(404).json({ success: false, message: "Category not found" });

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error while deleting category",
      error: err.message,
    });
  }
};
