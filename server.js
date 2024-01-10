import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js";

import cors from "cors";
import addContent from "./routes/assignmentRoutes.js";
import updateContentRouter from "./routes/updateContentRouter.js";
import getAllAssignments from "./routes/assignmentRoutes.js";
import deleteAssignmnet from "./routes/assignmentRoutes.js";
import addLinks from "./routes/linkRoutes.js";
import linkRoutes from "./routes/linkRoutes.js";

//rest object
const app = express();

//config env
dotenv.config();

//database config
connectDB();

//middlewares
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());
app.use(express.json());
app.use(cors());
app.use("/files", express.static("files", { fallthrough: false }));

app.get("/files/:filename", (req, res) => {
  const { filename } = req.params;
  const decodedFilename = decodeURIComponent(filename);

  if (!decodedFilename || !/^[a-zA-Z0-9_\-.%]+$/.test(decodedFilename)) {
    res.status(404).send("File not found");
    return;
  }

  res.sendFile(decodedFilename, { root: "./files" }, (err) => {
    if (err) {
      res.status(404).send("File not found");
    }
  });
});

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/updateAssignment", updateContentRouter);
app.use("/api/assignment", addContent);
app.use("/api/assignmnet", getAllAssignments);
app.use("/api/assignmnet", deleteAssignmnet);
app.use("/api/addLinks", linkRoutes);
//port
const PORT = process.env.PORT || 8080;

//run listen
app.listen(PORT, () => {
  console.log(`Server Runnnig on ${process.env.DEV_MODE} mode on ${PORT}`);
});
