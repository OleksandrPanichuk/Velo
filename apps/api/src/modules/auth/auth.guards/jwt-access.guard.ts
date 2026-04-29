import { ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";
import type { Request } from "express";
import { AuthStrategies } from "../auth.constants";

@Injectable()
export class JwtAccessGuard extends AuthGuard(AuthStrategies.JWT_ACCESS) {
	public override getRequest(context: ExecutionContext): Request {
		const gqlCtx = GqlExecutionContext.create(context);
		return gqlCtx.getContext<{ req: Request }>().req;
	}
}
