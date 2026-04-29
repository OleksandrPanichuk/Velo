import type { ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import type { Request, Response } from "express";

export const getGqlRequest = (ctx: ExecutionContext): Request =>
	GqlExecutionContext.create(ctx).getContext<{ req: Request }>().req;

export const getGqlResponse = (ctx: ExecutionContext): Response =>
	GqlExecutionContext.create(ctx).getContext<{ res: Response }>().res;
