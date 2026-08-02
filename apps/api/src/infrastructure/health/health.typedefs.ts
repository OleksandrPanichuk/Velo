import type { HealthIndicatorResult } from "@nestjs/terminus";

export interface HealthIndicatorContract {
	isHealthy(key: string): Promise<HealthIndicatorResult>;
}
