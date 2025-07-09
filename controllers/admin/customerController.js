const Customer = require("../../models/customer");

// create a customerControllers 
exports.createCustomer = async (req, res) => {
  try {
    console.log(req.file);
    const imagePath = req.file?.path;
    console.log("Image:",imagePath);
    const { name, email, phone, address,status } = req.body;
    console.log(req.body);

    // Check if customer already exists by email or phone
    const existing = await Customer.findOne({
      $or: [{ email }, { phone }],
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Customer with given email or phone already exists",
      });
    }

    const customer = new Customer({
      name,
      email,
      phone,
      address,
      status,
      image: imagePath,
    });


    await customer.save();

    res.status(201).json({
      success: true,
      message: "Customer created successfully",
      customer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error"+error });
  }
};

// Get all customers
exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.status(200).json({ data: customers, success: true, message: "Fetch" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get single customer by ID
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer)
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// update customer
exports.updateCustomer = async (req, res) => {
  try {
    const imagePath = req.file?.path;
    const { name, email, phone, address,status } = req.body;

    const data = { name, email, phone, address,status };
    if (imagePath) data.image = imagePath;

    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true }
    );

    if (!updatedCustomer)
      return res.status(404).json({ message: "Customer not found" });

    res.status(200).json({
      success: true,
      message: "Customer updated",
      customer: updatedCustomer,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete customer
exports.deleteCustomer = async (req, res) => {
  try {
    const deleted = await Customer.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Customer not found" });

    res
      .status(200)
      .json({ success: true, message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
