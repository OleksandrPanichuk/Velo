import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import { getGqlRequest, getGqlResponse } from "@/utils";
import type { Request } from "express";
import type { ServerResponse } from "node:http";

export const GqlReq = createParamDecorator((_: unknown, ctx: ExecutionContext): Request => getGqlRequest(ctx));

export const GqlRes = createParamDecorator((_: unknown, ctx: ExecutionContext): ServerResponse => getGqlResponse(ctx));
