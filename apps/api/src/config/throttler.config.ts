import { type Env } from "@/config/env.config";
import { RateLimits } from "@/constants";
import { ThrottlerStorageRedisService } from "@nest-lab/throttler-storage-redis";
import { type ExecutionContext } from "@nestjs/common";
import { type ConfigService } from "@nestjs/config";
import { type ThrottlerModuleOptions } from "@nestjs/throttler";
import Redis from "ioredis";

const UNTHROTTLED_PATHS = ["/health"];

function isUnthrottledRequest(context: ExecutionContext): boolean {
	if (context.getType<string>() !== "http") return false;

	const request = context.switchToHttp().getRequest<{ url?: string }>();
	const path = request?.url?.split("?")[0];

	return Boolean(path && UNTHROTTLED_PATHS.includes(path));
}

export const getThrottlerConfig = (config: ConfigService<Env>): ThrottlerModuleOptions => ({
	throttlers: [
		{
			name: "default",
			limit: config.get("THROTTLE_LIMIT", RateLimits.GLOBAL.limit),
			ttl: config.get("THROTTLE_TTL_MS", RateLimits.GLOBAL.ttl),
		},
	],
	skipIf: isUnthrottledRequest,
	storage: new ThrottlerStorageRedisService(
		new Redis({
			host: config.get("REDIS_HOST"),
			port: config.get("REDIS_PORT"),
		}),
	),
});
