import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITruckAvailability extends Document {
  driverId: Types.ObjectId; // reference to User (role = truck_driver)
  origin: string;
  destination: string;
  capacity: number; // kg or lbs
  availableFrom: Date; // start time/date
  availableUntil?: Date; // optional end time
  status: "open" | "matched" | "cancelled";
  createdAt: Date;
}

const TruckAvailabilitySchema: Schema = new Schema<ITruckAvailability>({
  driverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  capacity: { type: Number, required: true, min: 1 }, // must be positive
  availableFrom: { type: Date, required: true },
  availableUntil: { type: Date },
  status: {
    type: String,
    enum: ["open", "matched", "cancelled"],
    default: "open",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ITruckAvailability>(
  "TruckAvailability",
  TruckAvailabilitySchema
);
