const Product = require("../../models/product");

// Create a new product
exports.createProduct = async (req, res) => {

  const imagePath = req.file?.path;
  console.log(imagePath);
  const { title, desc, price,  color, size, categoryId } = req.body;
  console.log(req.body);



  try {
    const product = new Product({
      title,
      desc,
      price,
      image:imagePath,
      color,
      size,
      categoryId,
    });
    console.log(product);

    await product.save();

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Server error while creating product",
      error: err.message,
      
    });
   
  }
};

// get all products 
exports.getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { desc: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .populate("categoryId")
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error while fetching products",
      error: err.message,
    });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  const { id } = req.params;
  console.log(id)

  try {
    const product = await Product.findById(id).populate("categoryId", "category_name filepath");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error while fetching product",
      error: err.message,
    });
  }
};


// update a product
exports.updateProduct = async (req, res) => {
  const imagePath = req.file?.path;
  const { id } = req.params;
  const updateFields = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error while updating product",
      error: err.message,
    });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error while deleting product",
      error: err.message,
    });
  }
};

// const mongoose = require("mongoose");
// const Product = require("../../models/product");

// // Create Product
// exports.createProduct = async (req, res) => {
//   const { title, desc, price, color, size, categoryId } = req.body;
//   console.log(req.body);

//   try {
//     if (!title || !desc || !price || !color || !size || !categoryId) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required fields",
//       });
//     }

//     const imagePaths = req.file?.filePath
//     console.log(imagePaths);
//     if (imagePaths.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "At least one image is required",
//       });
//     }

//     const newProduct = new Product({
//       title,
//       desc,
//       price,
//       color,
//       size,
//       categoryId,
//       image: imagePaths,
//     });

//     await newProduct.save();

//     return res.status(201).json({
//       success: true,
//       message: "Product created successfully",
//       data: newProduct,
//     });
//   } catch (err) {
//     console.error("Create Product Error:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

// // Get All Products
// exports.getAllProduct = async (req, res) => {
//   try {
//     const products = await Product.find().populate("categoryId", "title");

//     return res.status(200).json({
//       success: true,
//       message: "Products fetched successfully",
//       data: products,
//     });
//   } catch (err) {
//     console.error("Get All Products Error:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

// // Get Product by ID
// exports.getProductById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid product ID",
//       });
//     }

//     const product = await Product.findById(id).populate("categoryId", "title");

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Product fetched successfully",
//       data: product,
//     });
//   } catch (err) {
//     console.error("Get Product By ID Error:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

// // Update Product
// exports.updateProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid product ID",
//       });
//     }

//     const imagePaths = req.files?.map((file) => file.path) || [];

//     const updatedData = {
//       ...req.body,
//       ...(imagePaths.length > 0 && { image: imagePaths }),
//     };

//     const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
//       new: true,
//     });

//     if (!updatedProduct) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Product updated successfully",
//       data: updatedProduct,
//     });
//   } catch (err) {
//     console.error("Update Product Error:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

// // Delete Product
// exports.deleteProduct = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid product ID",
//       });
//     }

//     const deletedProduct = await Product.findByIdAndDelete(id);

//     if (!deletedProduct) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Product deleted successfully",
//     });
//   } catch (err) {
//     console.error("Delete Product Error:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

