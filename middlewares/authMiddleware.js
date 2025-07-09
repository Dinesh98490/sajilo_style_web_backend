const jwt = require("jsonwebtoken");
const User = require("../models/user");

// const protect = async (req, res, next) => {
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer ")
//   ) {
//     try {
//       token = req.headers.authorization.split(" ")[1];
//       const decoded = jwt.verify(token, process.env.SECRET);
    

//       const user = await User.findById(decoded._id).select("-password");


//       if (!user) {
//         return res.status(401).json({
//           success: false,
//           message: "Not authorized, user not found",
//         });
//       }

//       req.user = user; 
//       return next();   

//     } catch (error) {
//       console.error("JWT verification error:", error.message);
//       return res.status(401).json({
//         success: false,
//         message: "Not authorized, token failed",
//       });
//     }
//   }

//   return res.status(401).json({
//     success: false,
//     message: "Not authorized, no token provided",
//   });
// };

// const admin = (req, res, next) => {
//   if (req.user && req.user.role === "Admin") {
//     return next();
//   } else {
//     return res.status(403).json({
//       success: false,
//       message: "Not authorized as an admin",
//     });
//   }
// };


const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Authentication failed: No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

  
      const user = await User.findById(decoded._id || decoded.userId).select('-password');
      if (!user) {
          return res.status(401).json({ success: false, message: "Authentication failed: User not found in database." });
      }

      
      req.user = user;
      next(); 

  } catch (err) {
      if (err.name === "TokenExpiredError") {
          return res.status(401).json({ success: false, message: "Token expired. Please login again." });
      }
      if (err.name === "JsonWebTokenError") {
          return res.status(401).json({ success: false, message: "Invalid token. Please login again." });
      }
     
      console.error("Authentication Error:", err); 
      return res.status(401).json({ success: false, message: "Authentication failed: Internal server error." });
  }
};

const requireRole = (requiredRole) => {
  return (req, res, next) => {
      
      if (!req.user) {
          return res.status(401).json({ success: false, message: "Unauthorized. Please authenticate first." });
      }

    
      if (req.user.role && req.user.role.toLowerCase() === requiredRole.toLowerCase()) {
          next(); 
      } else {
         
          return res.status(403).json({ success: false, message: `Access denied: ${requiredRole} role required.` });
      }
  };
};


module.exports = { 
  requireRole, 
  authenticateUser

 };