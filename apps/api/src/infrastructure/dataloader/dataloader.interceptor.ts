import {
	CallHandler,
	ExecutionContext,
	Injectable,
	InternalServerErrorException,
	NestInterceptor,
} from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import type { Observable } from "rxjs";
import DataLoader from "dataloader";
import { NestDataLoader } from "./dataloader.typedefs";

@Injectable()
export class DataLoaderInterceptor implements NestInterceptor {
	constructor(private readonly moduleRef: ModuleRef) {}

	public intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
		const graphqlExecutionContext = GqlExecutionContext.create(context);
		const ctx = graphqlExecutionContext.getContext();

		if (ctx) {
			if (!ctx.loaders) {
				ctx.loaders = new Map<string, typeof DataLoader<any, any>>();
			}

			if (!ctx.getLoader) {
				ctx.getLoader = <TId, TEntity>(
					loaderType: new (...args: any[]) => NestDataLoader<TId, TEntity>,
				): DataLoader<TId, TEntity | null> => {
					const typeName = loaderType.name;

					if (!ctx.loaders.has(typeName)) {
						const loaderFactory = this.moduleRef.get(loaderType, { strict: false });
						if (!loaderFactory) {
							throw new InternalServerErrorException(
								`DataLoader factory for ${typeName} not found in Dependency Injection`,
							);
						}
						ctx.loaders.set(typeName, loaderFactory.generateDataLoader());
					}

					return ctx.loaders.get(typeName);
				};
			}
		}

		return next.handle();
	}
}
