const Category = require("../../models/categories")

// Create Category
exports.createCategory = async (req, res) => {
    try {
      const { name, description, imageUrl } = req.body;
  
      
      if (!name || !description) {
        return res.status(400).json({ success: false, message: "Name and description are required" });
      }
  
      
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.status(400).json({ success: false, message: "Category already exists" });
      }
  
    
      const category = new Category({ name, description, imageUrl });
      await category.save();
  
      res.status(201).json({ success: true, message: "Category created", data: category });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  };
  
  // Get All Categories
  exports.getAllCategories = async (req, res) => {
    try {
      const categories = await Category.find().sort({ createdAt: -1 });
      res.status(200).json({ success: true, data: categories });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  };
  
  // Get Single Category by ID
  exports.getCategoryById = async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
  
      if (!category) {
        return res.status(404).json({ success: false, message: "Category not found" });
      }
  
      res.status(200).json({ success: true, data: category });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  };
  
  // Update Category
  exports.updateCategory = async (req, res) => {
    try {
      const { name, description, imageUrl } = req.body;
  
      const category = await Category.findByIdAndUpdate(
        req.params.id,
        { name, description, imageUrl },
        { new: true, runValidators: true }
      );
  
      if (!category) {
        return res.status(404).json({ success: false, message: "Category not found" });
      }
  
      res.status(200).json({ success: true, message: "Category updated", data: category });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  };
  
  // Delete Category
  exports.deleteCategory = async (req, res) => {
    try {
      const category = await Category.findByIdAndDelete(req.params.id);
  
      if (!category) {
        return res.status(404).json({ success: false, message: "Category not found" });
      }
  
      res.status(200).json({ success: true, message: "Category deleted" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  };