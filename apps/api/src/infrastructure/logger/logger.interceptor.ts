import { AppClsService } from "@/infrastructure/cls";
import { LoggerService } from "@/infrastructure/logger";
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Request, Response } from "express";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
	constructor(
		private readonly logger: LoggerService,
		private readonly cls: AppClsService,
	) {
		this.logger.setContext("HTTP");
	}

	public async intercept(
		context: ExecutionContext,
		next: CallHandler,
	): Promise<Observable<unknown>> {
		if (context.getType() !== "http") {
			return next.handle();
		}

		const request = context.switchToHttp().getRequest<Request>();
		const { method, url, ip, headers } = request;
		const userAgent = headers["user-agent"] || "";
		const startTime = Date.now();

		this.logger.logWithMetadata("debug", `Incoming Request: ${method} ${url}`, {
			ip,
			userAgent,
			requestId: this.cls.requestId,
			userId: this.cls.userId,
		});

		return next.handle().pipe(
			tap({
				next: () => {
					const response = context.switchToHttp().getResponse<Response>();
					const { statusCode } = response;
					const duration = Date.now() - startTime;

					this.logger.logRequest(method, url, statusCode, duration);

					if (duration > 1000) {
						this.logger.logWithMetadata("warn", `Slow request detected: ${method} ${url}`, {
							duration,
							statusCode,
						});
					}
				},
				error: (error: Error) => {
					const duration = Date.now() - startTime;
					this.logger.error(`Request failed: ${method} ${url}`, error.stack, "HTTP");
					this.logger.logWithMetadata("error", "Request Error Details", {
						method,
						url,
						duration,
						errorMessage: error.message,
						errorName: error.name,
					});
				},
			}),
		);
	}
}
