import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { HealthCheck, HealthCheckResult, HealthCheckService, TypeOrmHealthIndicator } from "@nestjs/terminus";
import { RedisHealthIndicator } from "./redis.health";
import { S3HealthIndicator } from "./s3.health";

@ApiTags("Health")
@Controller("health")
export class HealthController {
	constructor(
		private readonly health: HealthCheckService,
		private readonly db: TypeOrmHealthIndicator,
		private readonly redis: RedisHealthIndicator,
		private readonly s3: S3HealthIndicator,
	) {}

	@ApiOperation({ summary: "Check the health of the application" })
	@Get()
	@HealthCheck()
	public async check(): Promise<HealthCheckResult> {
		return this.health.check([
			async () => this.db.pingCheck("database"),
			async () => this.redis.isHealthy("redis"),
			async () => this.s3.isHealthy("s3"),
		]);
	}
}
