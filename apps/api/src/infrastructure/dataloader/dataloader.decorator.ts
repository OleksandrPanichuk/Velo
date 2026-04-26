import {
	createParamDecorator,
	type ExecutionContext,
	InternalServerErrorException,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { type NestDataLoaderContext } from "./dataloader.typedefs";

export const Loader = createParamDecorator((data: any, context: ExecutionContext) => {
	const ctx = GqlExecutionContext.create(context).getContext<NestDataLoaderContext>();

	if (!ctx?.getLoader) {
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
});
