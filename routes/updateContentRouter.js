import express from "express";
import multer from "multer";
const router = express.Router();
import {
    updateContent 
} from "../controllers/updateContent.js";

const upload = multer({ dest: "uploads/" });
//Update Assignment Router
router.put("/:id", upload.single("notes"), updateContent);

export default router;
