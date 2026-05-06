const dotenv = require("dotenv");
const { z } = require("zod");

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),
  JWT_SECRET: z.string().min(12, "JWT_SECRET must be at least 12 characters"),
  CORS_ORIGINS: z.string().default(
    "http://localhost:5173,http://127.0.0.1:5173,https://scraper-hn.vercel.app"
  ),
  FIREBASE_PROJECT_ID: z.string().optional(),
  SCRAPE_CRON: z.string().default("*/30 * * * *"),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(15 * 60 * 1000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(200),
  AUTH_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(20),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const formattedIssues = parsedEnv.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("\n");

  throw new Error(`Invalid environment configuration:\n${formattedIssues}`);
}

const env = parsedEnv.data;

module.exports = { env };
