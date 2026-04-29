import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import type { Request, Response } from "express";
import { getGqlRequest, getGqlResponse } from "@/utils";

export const GqlReq = createParamDecorator((_: unknown, ctx: ExecutionContext): Request => getGqlRequest(ctx));

export const GqlRes = createParamDecorator((_: unknown, ctx: ExecutionContext): Response => getGqlResponse(ctx));
