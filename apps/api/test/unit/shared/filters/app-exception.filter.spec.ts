import { AppExceptionFilter } from "@/shared/filters/app-exception.filter";
import { type ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common";
import { type ConfigService } from "@nestjs/config";
import { QueryFailedError } from "typeorm";
import type { Mock } from "vitest";

vi.mock("@sentry/nestjs", () => ({ captureException: vi.fn() }));

import * as Sentry from "@sentry/nestjs";

const mockConfig = {
	get: vi.fn().mockReturnValue("test"),
};

const buildFilter = () => new AppExceptionFilter(mockConfig as unknown as ConfigService);

const makeHttpHost = (overrides?: Partial<{ status: Mock; json: Mock; url: string }>) => {
	const res = {
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
		...overrides,
	};
	const req = { url: overrides?.url ?? "/test" };
	return {
		getType: vi.fn().mockReturnValue("http"),
		switchToHttp: vi.fn().mockReturnValue({
			getResponse: vi.fn().mockReturnValue(res),
			getRequest: vi.fn().mockReturnValue(req),
		}),
	} as unknown as ArgumentsHost;
};

const makeGqlHost = () =>
	({
		getType: vi.fn().mockReturnValue("graphql"),
	}) as unknown as ArgumentsHost;

describe("AppExceptionFilter", () => {
	beforeEach(() => vi.clearAllMocks());

	describe("HTTP context", () => {
		it("responds with correct status and body for HttpException", () => {
			const host = makeHttpHost();
			const res = host.switchToHttp().getResponse();

			buildFilter().catch(new HttpException("Not Found", HttpStatus.NOT_FOUND), host);

			expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({ statusCode: 404, error: "HTTP_EXCEPTION" }),
			);
		});

		it("responds with 400 for QueryFailedError", () => {
			const host = makeHttpHost();
			const res = host.switchToHttp().getResponse();
			const dbError = Object.assign(new QueryFailedError("SELECT 1", [], new Error("db error")), {
				code: "23000",
			});

			buildFilter().catch(dbError, host);

			expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
			expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: "DATABASE_ERROR" }));
		});

		it("responds with 409 for unique constraint violation (code 23505)", () => {
			const host = makeHttpHost();
			const res = host.switchToHttp().getResponse();
			const uniqueError = Object.assign(
				new QueryFailedError("INSERT", [], new Error("unique violation")),
				{ code: "23505" },
			);

			buildFilter().catch(uniqueError, host);

			expect(res.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({ error: "UNIQUE_CONSTRAINT_VIOLATION" }),
			);
		});

		it("responds with 500 for unknown Error", () => {
			const host = makeHttpHost();
			const res = host.switchToHttp().getResponse();

			buildFilter().catch(new Error("Something broke"), host);

			expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
		});

		it("captures 5xx errors with Sentry", () => {
			const host = makeHttpHost();
			const err = new Error("boom");

			buildFilter().catch(err, host);

			expect(Sentry.captureException).toHaveBeenCalledWith(err);
		});

		it("does not capture 4xx errors with Sentry", () => {
			const host = makeHttpHost();

			buildFilter().catch(new HttpException("Bad Request", 400), host);

			expect(Sentry.captureException).not.toHaveBeenCalled();
		});
	});

	describe("GraphQL context", () => {
		it("rethrows HttpException for graphql context", () => {
			const host = makeGqlHost();
			const exception = new HttpException("Forbidden", HttpStatus.FORBIDDEN);

			expect(() => buildFilter().catch(exception, host)).toThrow(HttpException);
		});

		it("throws a wrapped HttpException for non-Http errors in graphql context", () => {
			const host = makeGqlHost();

			expect(() => buildFilter().catch(new Error("internal"), host)).toThrow(HttpException);
		});
	});
});
