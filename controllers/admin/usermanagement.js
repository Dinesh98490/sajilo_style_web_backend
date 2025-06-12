const User = require("../../models/user");
const bcrypt = require("bcrypt");

// Create user
exports.createUser = async (req, res) => {
  const {
    fullName,
    age,
    address,
    phone_number,
    password,
    role,
  } = req.body;

  // Basic validation
  if (!fullName || !age || !address || !phoneNumber || !password) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    const existingUser = await User.findOne({ phone_number });

    if (existingUser) {
      return res.status(400).json({ success: false, message: "Phone number already registeres" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      age,
      address,
      phone_number,
      password: hashedPassword,
      role: role || "Customer",
    });

    await newUser.save();

    return res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get All Users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); 
    return res.status(200).json({ success: true, message: "Users fetched", data: users });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get One User by ID
exports.getOneUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, message: "User fetched", data: user });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update User
exports.updateOneUser = async (req, res) => {
  const {
    fullName,
    age,
    address,
    role,
  } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
         fullName,
          age,
          address,
          role,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, message: "User updated", data: updatedUser });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete User
exports.deleteOneUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, message: "User deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
