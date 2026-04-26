import { seconds } from "@repo/primitives";
import { z } from "zod";

export const envSchema = z.object({
	NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
	PORT: z.coerce.number().default(8080),
	WEB_URL: z.url(),
	BASE_URL: z.url(),
	// Database Config
	DB_HOST: z.string().default("localhost"),
	DB_PORT: z.coerce.number().int().positive().default(5432),
	DB_USERNAME: z.string().default("postgres"),
	DB_PASSWORD: z.string().default("postgres"),
	DB_NAME: z.string().default("postgres"),

	// Redis Config
	REDIS_HOST: z.string().default("localhost"),
	REDIS_PORT: z.coerce.number().int().positive().default(6379),

	// Cache
	CACHE_KEY_PREFIX: z.string().default("velo_cache"),
	CACHE_DEFAULT_TTL: z.coerce.number().int().positive().default(seconds(60)),
	CACHE_L1_TTL_MS: z.coerce.number().int().positive().default(seconds(10)),
	CACHE_L1_LRU_SIZE: z.coerce.number().int().positive().default(2000),

	// S3
	AWS_S3_ENDPOINT: z.string().default("http://localhost:9000"),
	AWS_S3_REGION: z.string().default("us-east-1"),
	AWS_S3_ACCESS_KEY: z.string().default("minio"),
	AWS_S3_SECRET_ACCESS_KEY: z.string().default("minio123456"),
	AWS_S3_BUCKET_NAME: z.string().default("velo"),
	AWS_S3_FORCE_PATH_STYLE: z
		.union([z.literal("true"), z.literal("false")])
		.transform((val) => val === "true")
		.default(true),
});

export type Env = z.infer<typeof envSchema>;
