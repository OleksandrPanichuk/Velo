import { type ExecutionContext, Global, Module } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import type { Request } from "express";
import { ClsModule } from "nestjs-cls";
import { randomUUID } from "node:crypto";
import { AppClsService } from "./cls.service";

@Global()
@Module({
	imports: [
		ClsModule.forRoot({
			global: true,
			guard: {
				mount: false,
				generateId: true,
				idGenerator: (ctx: ExecutionContext) => {
					const req =
						ctx.getType<string>() === "graphql"
							? GqlExecutionContext.create(ctx).getContext<{ req?: Request }>().req
							: ctx.switchToHttp().getRequest<Request>();
					return (req?.headers?.["x-request-id"] as string | undefined) ?? randomUUID();
				},
			},
		}),
	],
	providers: [AppClsService],
	exports: [AppClsService],
})
export class AppClsModule {}
