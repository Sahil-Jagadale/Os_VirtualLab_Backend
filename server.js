import express from "express";
import dotenv from "dotenv";
import { connect } from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js";

import cors from "cors";
import addContent from "./routes/assignmentRoutes.js";
import updateContentRouter from "./routes/updateContentRouter.js";

//rest object
const app = express();

//config env
dotenv.config();

//database config
connectDB();

//middlewares
app.use(cors());
app.use(express.json());

app.use("/api/assignment", addContent);
app.use("/api/updateAssignment", updateContentRouter);
app.use("/uploads", express.static("uploads"));

//port
const PORT = process.env.PORT || 8080;

//routes
app.use("/api/v1/auth", authRoutes);

//run listen
app.listen(PORT, () => {
  console.log(`Server Runnnig on ${process.env.DEV_MODE} mode on ${PORT}`);
});
