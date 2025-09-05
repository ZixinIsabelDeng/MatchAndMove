import { Router, Request, Response } from "express";
import Load from "../models/Load";
import TruckAvailability from "../models/TruckAvailability";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();
/**
 * POST /loads
 * Shipper posts a new load
 */
router.post(
  "/loads",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const { origin, destination, weight, description } = req.body;
      const shipperId = req.user?.id;

      if (!shipperId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const load = new Load({
        shipperId,
        origin,
        destination,
        weight,
        description,
      });

      await load.save();
      res.status(201).json(load);
    } catch (err) {
      res.status(500).json({ error: "Failed to post load", details: err });
    }
  }
);

/**
 * GET /loads
 * Search loads
 */
router.get("/loads", async (req: Request, res: Response) => {
  try {
    const { origin, destination } = req.query;

    const query: any = { status: "open" };
    if (origin) query.origin = origin;
    if (destination) query.destination = destination;

    const loads = await Load.find(query).populate("shipperId", "name email");
    res.json(loads);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch loads", details: err });
  }
});

/**
 * POST /trucks
 * Truck driver posts availability
 */
router.post(
  "/trucks",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const { origin, destination, capacity, availableFrom, availableUntil } =
        req.body;
      const driverId = req.user?.id;

      if (!driverId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const truck = new TruckAvailability({
        driverId,
        origin,
        destination,
        capacity,
        availableFrom,
        availableUntil,
      });

      await truck.save();
      res.status(201).json(truck);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Failed to post truck availability", details: err });
    }
  }
);

/**
 * GET /trucks
 * Search available trucks
 */
router.get("/trucks", async (req: Request, res: Response) => {
  try {
    const { origin, destination } = req.query;

    const query: any = { status: "open" };
    if (origin) query.origin = origin;
    if (destination) query.destination = destination;

    const trucks = await TruckAvailability.find(query).populate(
      "driverId",
      "name email"
    );
    res.json(trucks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch trucks", details: err });
  }
});

export default router;
