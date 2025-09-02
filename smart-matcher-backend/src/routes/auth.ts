import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import { generateToken } from "../utils/jwt";

// this allow us to define the routes like /signup
//later we will mount this at /auth
const router = Router();

/**
 * @route   POST /auth/signup
 * @desc    Register a new user
 */

router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    //check if user exist
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }
    const passwordHash = await bcrypt.hash(password, 10);

    // create new user
    const user: IUser = new User({ name, email, password, role });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ error: "Signup failed", details: err });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid cren" });
    }
    // Compare password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // sign jwt
    const token = generateToken({ id: String(user._id), role: user.role });

    // Sends token back to client.
    // Client will later store this token (in localStorage or cookie) and send it in Authorization header for future requests.
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Login failed", details: err });
  }
});

export default router;
