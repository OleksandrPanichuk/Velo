import { Env } from "@/config";
import {
	type ArgumentsHost,
	Catch,
	type ExceptionFilter,
	HttpException,
	HttpStatus,
	Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { GqlContextType } from "@nestjs/graphql";
import { NodeEnv } from "@repo/primitives";
import * as Sentry from "@sentry/nestjs";
import type { Request, Response } from "express";
import { QueryFailedError } from "typeorm";

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
	private readonly logger = new Logger(AppExceptionFilter.name);

	constructor(private readonly config: ConfigService<Env>) {}

	public catch(exception: unknown, host: ArgumentsHost): void {
		const type = host.getType<GqlContextType | "http">();

		let status = HttpStatus.INTERNAL_SERVER_ERROR;
		let message = "Internal Server Error";
		let code = "INTERNAL_SERVER_ERROR";

		if (exception instanceof HttpException) {
			status = exception.getStatus();
			const response = exception.getResponse();
			const responseMessage =
				typeof response === "object" && response !== null && "message" in response
					? (response as { message?: unknown }).message
					: undefined;
			message = typeof responseMessage === "string" ? responseMessage : exception.message;
			code = "HTTP_EXCEPTION";
		} else if (exception instanceof QueryFailedError) {
			status = HttpStatus.BAD_REQUEST;
			message = "A database error occurred.";
			code = "DATABASE_ERROR";

			if ("code" in exception && exception.code === "23505") {
				status = HttpStatus.CONFLICT;
				message = "A record with this unit already exists.";
				code = "UNIQUE_CONSTRAINT_VIOLATION";
			}
		} else if (exception instanceof Error) {
			message = exception.message;
			if (
				this.config.get("NODE_ENV") === NodeEnv.PRODUCTION &&
				status === HttpStatus.INTERNAL_SERVER_ERROR
			) {
				message = "Internal Server Error";
			}
		}

		const isServerError = status >= HttpStatus.INTERNAL_SERVER_ERROR;
		if (isServerError) {
			Sentry.captureException(exception);
		}

		this.logger.error(
			`${code}: ${message}`,
			exception instanceof Error ? exception.stack : undefined,
		);

		if (type === "graphql") {
			if (exception instanceof HttpException) {
				throw exception;
			}
			throw new HttpException({ statusCode: status, message, error: code }, status);
		}

		if (type === "http") {
			const ctx = host.switchToHttp();
			const response = ctx.getResponse<Response>();
			const request = ctx.getRequest<Request>();

			response.status(status).json({
				statusCode: status,
				timestamp: new Date().toISOString(),
				path: request.url,
				message,
				error: code,
			});
		}
	}
}
