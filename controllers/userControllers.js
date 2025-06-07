const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register User
exports.registerUser = async (req, res) => {
  const {
    firstName,
    middleName,
    lastName,
    age,
    address,
    phone_number,
    email,
    password,
    role
  } = req.body;

  try {
    if (!firstName || !lastName || !age || !address || !phone_number || !email || !password) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const existingUser = await User.findOne({ phone_number });

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this phone number' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      middleName,
      lastName,
      age,
      address,
      phone_number,
      email,
      password: hashedPassword,
      role: role || 'Customer',
    });

    await newUser.save();

    return res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const payload = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '7d' });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: user,
      token: token,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get All Users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    return res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      data: users,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get User by ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'User fetched successfully',
      data: user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
