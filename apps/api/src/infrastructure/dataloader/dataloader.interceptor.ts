import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import {GqlExecutionContext} from '@nestjs/graphql';
import {ModuleRef} from '@nestjs/core';
import {Observable} from 'rxjs';
import {NestDataLoader} from './dataloader.interface';
import DataLoader from 'dataloader';

export interface NestDataLoaderContext {
    getLoader: <ID, Type>(type: new (...args: any[]) => NestDataLoader<ID, Type>) => DataLoader<ID, Type | null>;
}

@Injectable()
export class DataLoaderInterceptor implements NestInterceptor {
    constructor(private readonly moduleRef: ModuleRef) {
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const graphqlExecutionContext = GqlExecutionContext.create(context);
        const ctx = graphqlExecutionContext.getContext();

        if (ctx) {
            if (!ctx.loaders) {
                ctx.loaders = new Map<string, typeof DataLoader<any, any>>();
            }

            if (!ctx.getLoader) {
                ctx.getLoader = <ID, Type>(
                    loaderType: new (...args: any[]) => NestDataLoader<ID, Type>,
                ): DataLoader<ID, Type | null> => {
                    const typeName = loaderType.name;

                    if (!ctx.loaders.has(typeName)) {
                        const loaderFactory = this.moduleRef.get(loaderType, {strict: false});
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

