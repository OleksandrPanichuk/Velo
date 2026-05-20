import { ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { ThrottlerGuard } from "@nestjs/throttler";

@Injectable()
export class AppThrottlerGuard extends ThrottlerGuard {
	public override getRequestResponse(context: ExecutionContext) {
		if (context.getType<string>() === "graphql") {
			const gqlCtx = GqlExecutionContext.create(context);
			const ctx = gqlCtx.getContext<{ req: unknown; res: unknown }>();
			return { req: ctx.req, res: ctx.res };
		}
		const http = context.switchToHttp();
		return { req: http.getRequest(), res: http.getResponse() };
	}
}
