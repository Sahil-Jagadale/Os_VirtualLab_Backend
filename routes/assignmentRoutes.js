import express from 'express';
import multer from 'multer';
import { addContent } from '../controllers/addContent.js';
import { getAllAssignments } from '../controllers/getAssignments.js';
import { deleteAssignment } from '../controllers/deleteAssignment.js';

const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});
  
const upload = multer({ storage: storage });

router.post('/addContent', upload.fields([
  { name: 'videos', maxCount: 10 }, // Adjust maxCount based on your requirement
  { name: 'files', maxCount: 10 }, // Adjust maxCount based on your requirement
]), addContent);
router.get('/getAllAssignments', getAllAssignments);
router.delete('/deleteAssignment/:id', deleteAssignment);

export default router;


