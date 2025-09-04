import { Router, Request, Response } from "express";
import CarpoolRide from "../models/CarpoolRide";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

/**
 * Post /rides
 * Driver post a new ride
 */

// we attach the authMiddleware to the route to ensure that the user is authenticated
// create the ride
router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  const { origin, destination, date, seatsAvailable, price } = req.body;
  const driverId = req.user?.id;
  if (!driverId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const newRide = new CarpoolRide({
    driverId,
    origin,
    destination,
    date,
    seatsAvailable,
    price,
  });
  await newRide.save();
  res.status(201).json(newRide);
});

// find the available ride
router.get("/", async (req: Request, res: Response) => {
  try {
    const { origin, destination, date, timeFrom, timeTo } = req.query;
    const query: any = { status: "open" };
    if (origin) query.origin = origin;
    if (destination) query.destination = destination;
    if (date) {
      // base day range (midnight → 23:59)
      const dayStart = new Date(date as string);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(date as string);
      dayEnd.setHours(23, 59, 59, 999);

      query.departure = { $gte: dayStart, $lte: dayEnd };
    }

    // user fill the optional time range field
    if (timeFrom && timeTo) {
      // customer wants a time range
      const from = new Date(`${date}T${timeFrom}:00`);
      const to = new Date(`${date}T${timeTo}:00`);

      query.departure = {
        $gte: from,
        $lte: to,
      };
    } else if (timeFrom) {
      // customer gives only one specific time
      const exact = new Date(`${date}T${timeFrom}:00`);
      const nextMinute = new Date(exact.getTime() + 60 * 1000);

      query.departure = {
        $gte: exact,
        $lt: nextMinute,
      };
    }

    const rides = await CarpoolRide.find(query).populate(
      "driverId",
      "name email"
    );
    res.json(rides);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch rides", details: err });
  }
});
/**
 * POST /rides/:id/request
 * Rider requests a seat in a ride
 */
router.post(
  "/:id/request",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const ride = await CarpoolRide.findById(req.params.id);

      if (!ride) {
        return res.status(404).json({ message: "Ride not found" });
      }

      if (ride.status != "open") {
        return res.status(400).json({ message: `Ride is ${ride.status}` });
      }

      // check seats
      if (ride.seatsAvailable == 0) {
        ride.status = "full";
        await ride.save();
        return res.status(400).json({ message: "No seats available" });
      }

      ride.seatsAvailable -= 1;

      await ride.save();
      res.json({ message: "Seat requested successfully", ride });
    } catch (err) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

export default router;
