import jwt, { JwtPayload as DefaultJwtPayload } from "jsonwebtoken";
import ms from "ms";

// Extend the standard JwtPayload with our app-specific fields
export interface AppJwtPayload extends DefaultJwtPayload {
  id: string;
  role: "carpool_driver" | "carpool_rider" | "truck_driver" | "shipper";
}

// Generate a token for a user
export const generateToken = (
  payload: AppJwtPayload,
  expiresIn: number | ms.StringValue = "1h"
): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign(payload, secret, { expiresIn });
};

// Verify a token and return the decoded payload
export const verifyToken = (token: string): AppJwtPayload | null => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  try {
    return jwt.verify(token, secret) as AppJwtPayload;
  } catch (err) {
    // Token could be expired, malformed, or signed with the wrong key
    console.error("JWT verification failed:", err);
    return null; // let the caller decide how to handle invalid tokens
  }
};
