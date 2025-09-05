//This interface gives compile-time type checking in TypeScript.
import mongoose, { Schema, Document, Types } from "mongoose";
export interface ILoad extends Document {
  shipperId: Types.ObjectId; // reference to User (role = shipper)
  origin: string;
  destination: string;
  weight: number; // kg or lbs
  description?: string; // optional cargo details
  status: "open" | "matched" | "cancelled";
  createdAt: Date;
}

//This is where Mongoose enforces validation rules at the database level.
const LoadSchema: Schema = new Schema<ILoad>({
  shipperId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  weight: { type: Number, required: true, min: 1 }, // must be positive
  description: { type: String },
  status: {
    type: String,
    enum: ["open", "matched", "cancelled"],
    default: "open",
  },
  createdAt: { type: Date, default: Date.now },
});

// model Creation
export default mongoose.model<ILoad>("Load", LoadSchema);
