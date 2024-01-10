import express from "express";
import { addLinks } from "../controllers/addLinks.js"; // Assuming the controller file path is correct

const router = express.Router();

router.post("/", addLinks);

export default router;
