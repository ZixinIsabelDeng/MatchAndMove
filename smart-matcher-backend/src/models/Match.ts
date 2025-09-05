import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMatch extends Document {
  type: "carpool" | "backhaul"; // type of match
  riderId?: Types.ObjectId; // for carpool
  rideId?: Types.ObjectId;
  loadId?: Types.ObjectId; // for backhaul
  truckId?: Types.ObjectId;
  createdAt: Date;
}

const MatchSchema: Schema = new Schema<IMatch>({
  type: { type: String, enum: ["carpool", "backhaul"], required: true },

  // Carpool match
  riderId: { type: Schema.Types.ObjectId, ref: "User" },
  rideId: { type: Schema.Types.ObjectId, ref: "CarpoolRide" },

  // Backhaul match
  loadId: { type: Schema.Types.ObjectId, ref: "Load" },
  truckId: { type: Schema.Types.ObjectId, ref: "TruckAvailability" },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IMatch>("Match", MatchSchema);
