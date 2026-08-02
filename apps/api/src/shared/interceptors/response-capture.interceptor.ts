import { AppClsService } from "@/infrastructure/cls";
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import type { ServerResponse } from "node:http";
import type { Observable } from "rxjs";

@Injectable()
export class ResponseCaptureInterceptor implements NestInterceptor {
	constructor(private readonly cls: AppClsService) {}

	public intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
		if (context.getType<string>() === "graphql") {
			const res = GqlExecutionContext.create(context).getContext<{ res?: ServerResponse }>().res;
			if (res) this.cls.setResponse(res);
		} else {
			const res = context.switchToHttp().getResponse<ServerResponse>();
			if (res) this.cls.setResponse(res);
		}
		return next.handle() as Observable<unknown>;
	}
}
