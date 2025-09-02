import { Router, Request, Response } from "express";
import CarpoolRide from "../models/CarpoolRide";
import { authMiddleware, AuthRequest } from "../middleware/auth";
const rounter = Router();
