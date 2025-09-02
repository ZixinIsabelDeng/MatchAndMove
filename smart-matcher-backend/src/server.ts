// application - the whole Express app
// request - the HTTP response request obhect (things like req.body,req.params)
// response -http response object like res.json(). res.send
import express, { Application, Request, Response } from "express";
// library connects and interact with MongoDB
import mongoose from "mongoose";
//cors origin resource sharing
// import CORS middle wear, let your front end running on another port like 3000, make api call the backend
import cors from "cors";
// import dotenv, it loads environement variable from a .env file to process.env

import dotenv from "dotenv";
import { authMiddleware } from "./middleware/auth";
import authRoutes from "./routes/auth";

// tell node to read the env file and put those values into the process.emv
dotenv.config();

//create an express app instance
const app: Application = express();

// read port from your env, if not found go for default 5000
const PORT = process.env.PORT || 5000;

//enable cors for all rountes so front end can call API
app.use(cors());

// make Express parse JSON request
// without this req.body would be undefined
app.use(express.json);

app.use("/auth", authRoutes);
//create a simple get routes,
//when someone visit localhost 5000, this runs
//it response with json message
// this is called health check
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Smart Matcher API is running" });
});

app.get("/users/me", authMiddleware, (req, res) => {
  res.json({ message: "Hello, your token is valid!", user: (req as any).user });
});

const MONGO_URI = process.env.MONGO_URI as string;
// connect to mongo db, if there is error catch it
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err: Error) => {
    console.error("❌ MongoDB connection error:", err);
  });
