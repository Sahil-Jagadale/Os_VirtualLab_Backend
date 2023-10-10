import express from "express";
import multer from "multer";
const router = express.Router();
import { addContent } from "../controllers/addContent.js";
import { updateContent } from "../controllers/updateContent.js";

const upload = multer({ dest: "uploads/" });

router.post("/addContent", upload.single("notes"), addContent);


export default router;
