const jwt = require("jsonwebtoken");
const User = require("../models/user");

// check the aunthetic user 
exports.authenticateUser = async (req, res, next) => {
    try {
      
        //get tokem from the header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res
          .status(401)
          .json({ Success: false, message: "Authentication required" });
      }
      const token = authHeader.split(" ")[1]; 
      const decoded = jwt.verify(token, process.env.SECRET);
      const user = await User.findOne({ _id: decoded._id });
      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "Token mismatch" });
      }
  
      
      req.user = user;
      next(); 
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, message: "authentications Failed" });
    }
  };
  
  exports.isAdmin = async (req, res, next) => {
    if (req.user && req.user.role == "admin") {
      next();
    } else {
      return res
        .status(403)
        .json({ success: false, message: "Admin rpivilage required" });
    }
  };
  
