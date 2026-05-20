import type { ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import type { Request } from "express";
import type { ServerResponse } from "node:http";

export const getGqlRequest = (ctx: ExecutionContext): Request =>
	GqlExecutionContext.create(ctx).getContext<{ req: Request }>().req;

export const getGqlResponse = (ctx: ExecutionContext): ServerResponse =>
	GqlExecutionContext.create(ctx).getContext<{ res: ServerResponse }>().res;
