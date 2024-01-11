import express from "express";
import { addLinks } from "../controllers/addLinks.js";
import { getAllLinks } from "../controllers/getAllLinks.js"; 

const router = express.Router();

router.post("/", addLinks);
router.get("/getAllLinks", getAllLinks);

export default router;
