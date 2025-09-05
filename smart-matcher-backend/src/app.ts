import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
// import rideRoutes from "./routes/rides"; // Commented out due to missing module
import logisticsRoutes from "./routes/logistics";

const app = express();
app.use(express.json());

// routes
app.use("/auth", authRoutes);
//app.use("/rides", rideRoutes);
app.use("/logistics", logisticsRoutes);

export default app;
