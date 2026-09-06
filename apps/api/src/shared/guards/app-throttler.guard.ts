import { type ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { ThrottlerGuard } from "@nestjs/throttler";
import type { Request, Response } from "express";

interface ThrottlerRequestResponse {
	req: Request;
	res: Response;
}

@Injectable()
export class AppThrottlerGuard extends ThrottlerGuard {
	public override getRequestResponse(context: ExecutionContext): ThrottlerRequestResponse {
		if (context.getType<string>() === "graphql") {
			const gqlContext = GqlExecutionContext.create(context).getContext<ThrottlerRequestResponse>();

			return { req: gqlContext.req, res: gqlContext.res };
		}

		const http = context.switchToHttp();

		return { req: http.getRequest<Request>(), res: http.getResponse<Response>() };
	}
}
