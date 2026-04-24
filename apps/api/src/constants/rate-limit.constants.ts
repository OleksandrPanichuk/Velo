import {minutes} from "@nestjs/throttler";

export const RateLimits = {
    GLOBAL: {
        limit: 10,
        ttl: minutes(1),
    },
} as const;
