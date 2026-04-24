import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { NestDataLoaderContext } from './dataloader.interceptor';

export const Loader = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context).getContext<NestDataLoaderContext>();

    if (!ctx || !ctx.getLoader) {
      throw new InternalServerErrorException(
        `DataLoaderInterceptor is not applied to this route/resolver. Make sure to bind it using @UseInterceptors() or globally app.useGlobalInterceptors()`,
      );
    }

    if (!data) {
      throw new InternalServerErrorException(
        `@Loader parameter is missing the DataLoader definition class`,
      );
    }

    return ctx.getLoader(data);
  },
);

