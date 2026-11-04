import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(3001),
  MONGODB_URI: z.string().min(1).default("mongodb://localhost:27017/nursery_management"),
  JWT_ACCESS_SECRET: z.string().min(32).default("default-development-jwt-access-secret-32-chars-long"),
  JWT_REFRESH_SECRET: z.string().min(32).default("default-development-jwt-refresh-secret-32-chars-long"),
  CORS_ORIGINS: z.string().default("http://localhost:5173"),
});

export const env = schema.parse(process.env);
