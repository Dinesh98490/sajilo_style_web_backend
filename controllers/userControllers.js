const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// register users code 
exports.registerUser = async (req, res) => {
  const { fullName, phone_number, email, password, role } = req.body;

  try {
    if (!fullName || !phone_number || !email || !password ) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }


    if (!["Customer", "Admin"].includes(role)) {
      return res.status(400).json({ success: false, message: "role must be 'Customer' or 'Admin'" });
  }

    const existingUser = await User.findOne({ phone_number });

    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists with this phone number" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      phone_number,
      email,
      password: hashedPassword,
      role: role || "Customer",
    });

    await newUser.save();

    return res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// login user logics 
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body)

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const payload = {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "7d" });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: user,
      token: token,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};



// get all users 
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get User by ID
exports.getUserById = async (req, res) => {
  const { email, password, role } = req.params;

  if (!email || !password || !role) {
    return res.status(400).json({ success: false, message: "All fields are required" });
}

  try {
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};




// // update the use by the amdin
// exports.updateUserByAdmin = async(req, res) => {
//   try {
//     const {fullName, phone_number , email, password} = req.body

//     const user = await User.getUserById(
//       req.params.id ,
//       {fullName, phone_number , email, password} ,
//       {new : true , runValidators : true}

//     ) ;
//     if(!user)
// {
//   return res.status(404).json({message : "User not found"})
// }

// return res.status(200).json({
//   success : true ,
//   data : user ,
//   message : "User Updated by admin"

// })
//   }
//   catch(e){
//     console.log(e)
//      return res.status(500).json({ success: false, message: "Server error" });

//   }
// }




// delete user by id
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  // find by id user
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
