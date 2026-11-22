 
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z.coerce.number().int().positive().default(5000),

  MONGODB_URI: z.string().min(1, "MongoDB URI is required"),

  CLIENT_URL: z
    .string()
    .url()
    .default("http://localhost:5173"),

  ACCESS_TOKEN_SECRET: z
    .string()
    .min(32, "Access token secret must be at least 32 characters"),

  REFRESH_TOKEN_SECRET: z
    .string()
    .min(32, "Refresh token secret must be at least 32 characters"),

    GROQ_API_KEY: z.string().min(1, "GROQ_API_KEY is required"),
GROQ_MODEL: z.string().min(1).default("openai/gpt-oss-120b"),

CLOUDINARY_CLOUD_NAME: z.string().min(1, "Cloudinary cloud name is required"),
CLOUDINARY_API_KEY: z.string().min(1, "Cloudinary API key is required"),
CLOUDINARY_API_SECRET: z.string().min(1, "Cloudinary API secret is required"),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("Invalid environment configuration:");
  console.error(result.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = result.data;
