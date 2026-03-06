import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const generateToken = (payload) => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
};

export const generateResetToken = (payload) => {
  // MUST expire in 1 hour
  return jwt.sign(payload, env.RESET_PASSWORD_SECRET, { expiresIn: "1h" });
};

export const verifyResetToken = (token) => {
  return jwt.verify(token, env.RESET_PASSWORD_SECRET);
};
