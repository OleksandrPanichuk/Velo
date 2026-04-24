import {ThrottlerStorageRedisService} from "@nest-lab/throttler-storage-redis";
import {ConfigService} from "@nestjs/config";
import {ThrottlerModuleOptions} from "@nestjs/throttler";
import Redis from "ioredis";
import {Env} from "@/config/env.config";
import {RateLimits} from "@/constants";

export const getThrottlerConfig = (
    config: ConfigService<Env>,
): ThrottlerModuleOptions => ({
    throttlers: [RateLimits.GLOBAL],
    storage: new ThrottlerStorageRedisService(
        new Redis({
            host: config.get("REDIS_HOST"),
            port: config.get("REDIS_PORT"),
        }),
    ),
});
