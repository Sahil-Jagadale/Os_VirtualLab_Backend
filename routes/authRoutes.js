import express from "express";
const router = express.Router();
import {
  registerController,
  loginController,
  forgotPasswordController,
  verificationController,//me
  resetPasswordController,
  approveUserController,
} from "../controllers/authController.js";




//routing
//REGISTER || METHOD POST
router.post("/register", registerController);

//LOGIN || METHOD POST
router.post("/login", loginController);
router.get('/approve/:token', approveUserController);

//Forgot Password|| METHOD POST
router.post("/forgot-Password", forgotPasswordController);

router.post("/reset-password/:token", resetPasswordController);

//Email verification route
router.get("/verify/:token", verificationController); 


export default router;

