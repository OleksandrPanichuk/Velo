import { generateRedisUrl } from "@/utils";
import { createKeyv } from "@keyv/redis";
import { type CacheOptions } from "@nestjs/cache-manager";
import type { ConfigService } from "@nestjs/config";
import { seconds } from "@nestjs/throttler";
import type { Env } from "./env.config";

export const getCacheConfig = (config: ConfigService<Env>): CacheOptions => {
	const port = config.getOrThrow<number>("REDIS_PORT");
	const host = config.getOrThrow<string>("REDIS_HOST");

	const redisUrl = generateRedisUrl({
		port,
		host,
	});
	return {
		stores: [createKeyv(redisUrl)],
		ttl: seconds(60),
	};
};
