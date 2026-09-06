import type { Env } from "@/config";
import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HealthIndicatorService, type HealthIndicatorResult } from "@nestjs/terminus";
import Redis from "ioredis";
import { HealthIndicatorContract } from "./health.typedefs";

@Injectable()
export class RedisHealthIndicator implements OnModuleDestroy, HealthIndicatorContract {
	private readonly redis: Redis;

	constructor(
		private readonly healthIndicatorService: HealthIndicatorService,
		config: ConfigService<Env>,
	) {
		this.redis = new Redis({
			host: config.getOrThrow("REDIS_HOST"),
			port: config.getOrThrow("REDIS_PORT"),
			lazyConnect: true,
		});
	}

	public async isHealthy(key: string): Promise<HealthIndicatorResult> {
		const indicator = this.healthIndicatorService.check(key);
		try {
			await this.redis.ping();
			return indicator.up();
		} catch (error) {
			return indicator.down({ error: (error as Error).message });
		}
	}

	public onModuleDestroy(): void {
		this.redis.disconnect();
	}
}
