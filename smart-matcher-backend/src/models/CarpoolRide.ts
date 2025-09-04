import mongoose, { Schema, Document, Types } from "mongoose";
export interface ICarPoolRide extends Document {
  driverId: Types.ObjectId; // linked to User
  origin: string; // could be made geospatial later
  destination: string;
  departure: Date;
  seatsAvailable: number;
  price: number;
  status: "open" | "full" | "cancelled";
  createdAt: Date;
}
const CarpoolRideSchema: Schema = new Schema<ICarPoolRide>({
  driverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  departure: { type: Date, required: true },
  seatsAvailable: { type: Number, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ["open", "full", "cancelled"], required: true },
  createdAt: { type: Date, default: Date.now },
});
export default mongoose.model<ICarPoolRide>("CarpoolRide", CarpoolRideSchema);
