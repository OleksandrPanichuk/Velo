import {z} from "zod";

export const envSchema = z.object({
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),
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
});

export type Env = z.infer<typeof envSchema>;
