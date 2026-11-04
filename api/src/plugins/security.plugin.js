import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import { env } from "../config/env.js";

export async function registerSecurity(app) {
  const origins = env.CORS_ORIGINS.split(",").map((value) => value.trim());
  await app.register(helmet);
  await app.register(cors, {
    origin: origins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  });
  await app.register(rateLimit, { max: 120, timeWindow: "1 minute" });
}
