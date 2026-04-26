import { minutes } from "@repo/primitives";

export const RateLimits = {
	GLOBAL: {
		limit: 10,
		ttl: minutes(1),
	},
} as const;
