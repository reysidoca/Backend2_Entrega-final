import express from "express";
import cookieParser from "cookie-parser";
import passport from "passport";

import { assertEnv, env } from "./config/env.js";
import { connectMongo } from "./config/mongo.js";
import { initializePassport } from "./config/passport.js";

import sessionsRouter from "./routes/sessions.router.js";
import usersRouter from "./routes/users.router.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

initializePassport();
app.use(passport.initialize());

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/sessions", sessionsRouter);
app.use("/api/users", usersRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.use(errorHandler);

const start = async () => {
  try {
    assertEnv();
    await connectMongo();
    app.listen(env.PORT, () => console.log(`🚀 Server en http://localhost:${env.PORT}`));
  } catch (err) {
    console.error("❌ Error iniciando servidor:", err);
    process.exit(1);
  }
};

start();
