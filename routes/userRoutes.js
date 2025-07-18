const express = require('express');
const router = express.Router();
// const userController = require('../controllers/userControllers');
const { registerUser, loginUser, sendResetLink, resetPassword } = require("../controllers/userControllers") 
const { authenticateUser } = require("../middlewares/authMiddleware");


// routes of the users
router.post('/register', registerUser);
router.post('/login', loginUser);
// router.get('/users', userController.getUsers);
// router.get('/users/:id', userController.getUserById);
// router.delete('/users/:id', userController.deleteUser);




router.post("/request-reset", sendResetLink);
router.post("/reset-password/:token", resetPassword);







// router.get("/me", authenticateUser, userController.getMe);

module.exports = router;




// router.get("/",
//    protect ,
//    admin,
//     userController.getAllUser);

// router.get("/:id",
//   protect ,
//    admin, 
//    userController.getUserById);

// router.put(
//      "/:id",
//      protect ,
//      admin,
//    userController.updateUserByAdmin);

// router.delete("/:id",
//    protect ,    
//    userController.deleteUser);

// router.put("/role/:userToUpdateId" , admin , userController.updateUserRole)

// module.exports = router;
   
