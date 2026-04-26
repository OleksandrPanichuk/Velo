import { type Env } from "@/config/env.config";
import { RateLimits } from "@/constants";
import { ThrottlerStorageRedisService } from "@nest-lab/throttler-storage-redis";
import { type ConfigService } from "@nestjs/config";
import { type ThrottlerModuleOptions } from "@nestjs/throttler";
import Redis from "ioredis";

export const getThrottlerConfig = (config: ConfigService<Env>): ThrottlerModuleOptions => ({
	throttlers: [RateLimits.GLOBAL],
	storage: new ThrottlerStorageRedisService(
		new Redis({
			host: config.get("REDIS_HOST"),
			port: config.get("REDIS_PORT"),
		}),
	),
});
