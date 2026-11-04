import fp from "fastify-plugin";
import mongoose from "mongoose";
import { env } from "../config/env.js";
import * as models from "../models/index.js";

async function mongoosePlugin(app) {
  try {
    const connection = await mongoose.connect(env.MONGODB_URI);
    app.log.info("MongoDB connected successfully");

    app.decorate("mongoose", connection);
    app.decorate("models", models);

    app.addHook("onClose", async () => {
      await mongoose.disconnect();
    });
  } catch (error) {
    app.log.error(error, "Failed to connect to MongoDB");
    throw error;
  }
}

export default fp(mongoosePlugin, { name: "mongoose" });

