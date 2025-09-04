//schema: lets you define the shape of your documents (like a blueprint).
//document: a TypeScript interface from Mongoose, representing a MongoDB document

//This interface gives compile-time type checking in TypeScript.
import mongoose, { Schema, Document } from "mongoose";
export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: "carpool_driver" | "carpool_rider" | "truck_driver" | "shipper";
  createdAt: Date;
}

//This is where Mongoose enforces validation rules at the database level.
const UserSchema: Schema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    emum: ["carpool_driver", "carpool_rider", "truck_driver", "shipper"],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

// model Creation
export default mongoose.model<IUser>("User", UserSchema);
