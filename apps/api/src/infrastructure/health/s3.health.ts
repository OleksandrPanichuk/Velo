import type { Env } from "@/config";
import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HealthIndicatorService, type HealthIndicatorResult } from "@nestjs/terminus";
import { IHealthIndicator } from "./health.typedefs";

@Injectable()
export class S3HealthIndicator implements IHealthIndicator {
	private readonly client: S3Client;

	constructor(
		private readonly healthIndicatorService: HealthIndicatorService,
		config: ConfigService<Env>,
	) {
		this.client = new S3Client({
			endpoint: config.getOrThrow("AWS_S3_ENDPOINT"),
			region: config.getOrThrow("AWS_S3_REGION"),
			credentials: {
				accessKeyId: config.getOrThrow("AWS_S3_ACCESS_KEY"),
				secretAccessKey: config.getOrThrow("AWS_S3_SECRET_ACCESS_KEY"),
			},
			forcePathStyle: config.getOrThrow("AWS_S3_FORCE_PATH_STYLE"),
		});
	}

	public async isHealthy(key: string): Promise<HealthIndicatorResult> {
		const indicator = this.healthIndicatorService.check(key);
		try {
			await this.client.send(new ListBucketsCommand({}));
			return indicator.up();
		} catch (error) {
			return indicator.down({ error: (error as Error).message });
		}
	}
}
