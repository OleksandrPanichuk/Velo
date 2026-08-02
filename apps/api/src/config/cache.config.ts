import { generateRedisUrl } from "@/utils";
import { createKeyv } from "@keyv/redis";
import { type CacheOptions } from "@nestjs/cache-manager";
import type { ConfigService } from "@nestjs/config";
import { CacheableMemory } from "cacheable";
import { Keyv } from "keyv";
import type { Env } from "./env.config";

export const getCacheConfig = (config: ConfigService<Env>): CacheOptions => {
	const port = config.getOrThrow<number>("REDIS_PORT");
	const host = config.getOrThrow<string>("REDIS_HOST");

	const redisUrl = generateRedisUrl({
		port,
		host,
	});

	const l1TtlMs = config.getOrThrow<number>("CACHE_L1_TTL_MS");
	const l1LruSize = config.getOrThrow<number>("CACHE_L1_LRU_SIZE");

	return {
		stores: [
			new Keyv({
				store: new CacheableMemory({ ttl: l1TtlMs, lruSize: l1LruSize }),
			}),
			createKeyv(redisUrl, {
				namespace: config.getOrThrow<string>("CACHE_KEY_PREFIX"),
			}),
		],
		ttl: config.get<number>("CACHE_DEFAULT_TTL"),
		nonBlocking: true,
	};
};
