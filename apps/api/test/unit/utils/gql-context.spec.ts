import { vi } from "vitest";
import { type ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { getGqlRequest, getGqlResponse } from "@/utils";
import { type ServerResponse } from "node:http";

vi.mock("@nestjs/graphql", () => ({
	GqlExecutionContext: { create: vi.fn() },
}));

const makeExecutionContext = () => ({}) as ExecutionContext;

describe("getGqlRequest", () => {
	let gqlCtx: { getContext: ReturnType<typeof vi.fn> };

	beforeEach(() => {
		gqlCtx = { getContext: vi.fn() };
		vi.mocked(GqlExecutionContext.create).mockReturnValue(gqlCtx as never);
	});

	it("creates a GQL context from the execution context", () => {
		const ctx = makeExecutionContext();
		gqlCtx.getContext.mockReturnValue({ req: {} });

		getGqlRequest(ctx);

		expect(GqlExecutionContext.create).toHaveBeenCalledWith(ctx);
	});

	it("returns the request object from the GQL context", () => {
		const req = { headers: { authorization: "Bearer token" } } as unknown as Request;
		gqlCtx.getContext.mockReturnValue({ req });

		const result = getGqlRequest(makeExecutionContext());

		expect(result).toBe(req);
	});
});

describe("getGqlResponse", () => {
	let gqlCtx: { getContext: ReturnType<typeof vi.fn> };

	beforeEach(() => {
		gqlCtx = { getContext: vi.fn() };
		vi.mocked(GqlExecutionContext.create).mockReturnValue(gqlCtx as never);
	});

	it("creates a GQL context from the execution context", () => {
		const ctx = makeExecutionContext();
		gqlCtx.getContext.mockReturnValue({ res: {} });

		getGqlResponse(ctx);

		expect(GqlExecutionContext.create).toHaveBeenCalledWith(ctx);
	});

	it("returns the response object from the GQL context", () => {
		const res = { statusCode: 200 } as unknown as ServerResponse;
		gqlCtx.getContext.mockReturnValue({ res });

		const result = getGqlResponse(makeExecutionContext());

		expect(result).toBe(res);
	});
});
