import mongoose, { Schema, Document, Types } from "mongoose";
export interface ICarPoolRide extends Document {
  driverId: Types.ObjectId; // linked to User
  origin: string; // could be made geospatial later
  destination: string;
  date: Date;
  seatsAvailable: number;
  price: number;
  status: "open" | "full" | "cancelled";
  createdAt: Date;
}
