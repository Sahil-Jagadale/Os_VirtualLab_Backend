import express from "express";
const router = express.Router();
import {
  registerController,
  loginController,
  forgotPasswordController,
} from "../controllers/authController.js";


//routing
//REGISTER || METHOD POST
router.post("/register", registerController);

//LOGIN || METHOD POST
router.post("/login", loginController);

//Forgot Password|| METHOD POST
router.post("/forgot-Password", forgotPasswordController);


export default router;
