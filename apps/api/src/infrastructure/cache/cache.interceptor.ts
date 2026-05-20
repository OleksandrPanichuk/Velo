import { CacheInterceptor as NestCacheInterceptor } from "@nestjs/cache-manager";
import { ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { type GraphQLResolveInfo, OperationTypeNode } from "graphql";

@Injectable()
export class CacheInterceptor extends NestCacheInterceptor {
	public async trackBy(context: ExecutionContext): Promise<string | null | undefined> {
		if (context.getType<string>() !== "graphql") {
			return super.trackBy(context);
		}

		const gqlCtx = GqlExecutionContext.create(context);
		const info = gqlCtx.getInfo<GraphQLResolveInfo>();

		if (info.operation.operation !== OperationTypeNode.QUERY) {
			return undefined;
		}

		const args = gqlCtx.getArgs<Record<string, unknown>>();
		return `gql:${info.fieldName}:${JSON.stringify(args)}`;
	}
}
