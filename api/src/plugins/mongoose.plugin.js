import fp from "fastify-plugin";
import mongoose from "mongoose";
import { env } from "../config/env.js";
import * as models from "../models/index.js";

async function mongoosePlugin(app) {
  app.decorate("mongoose", mongoose);
  app.decorate("models", models);

  // Connect asynchronously in background with a reasonable server selection timeout
  mongoose
    .connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    })
    .then(() => {
      app.log.info("MongoDB connected successfully");
    })
    .catch((error) => {
      app.log.error({ err: error.message }, "MongoDB connection failed or deferred");
    });

  app.addHook("onClose", async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });
}

export default fp(mongoosePlugin, { name: "mongoose" });
