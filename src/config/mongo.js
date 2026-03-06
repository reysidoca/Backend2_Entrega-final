import mongoose from "mongoose";
import { env } from "./env.js";

export const connectMongo = async () => {
  await mongoose.connect(env.MONGO_URL);
  console.log("✅ MongoDB conectado");
};
