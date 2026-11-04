import fp from "fastify-plugin";
import mongoose from "mongoose";
import { env } from "../config/env.js";
import * as models from "../models/index.js";

async function mongoosePlugin(app) {
  app.decorate("mongoose", mongoose);
  app.decorate("models", models);

  try {
    app.log.info("Connecting to MongoDB...");
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    app.log.info("MongoDB connected successfully");
  } catch (error) {
    app.log.error({ err: error.message }, "MongoDB initial connection failed");
    // Do not crash, but log clearly
  }

  app.addHook("onClose", async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });
}

export default fp(mongoosePlugin, { name: "mongoose" });
