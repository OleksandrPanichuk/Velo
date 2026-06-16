/**
 * Bootstrap smoke test — verifies the test app starts and the GraphQL
 * endpoint is reachable (200 for introspection, 404 for unknown routes).
 */
vi.mock("@sentry/nestjs", () => ({ captureException: vi.fn() }));
vi.mock("@nestjs-cls/transactional", () => ({
	Transactional: () => (_target: unknown, _key: string, descriptor: PropertyDescriptor) =>
		descriptor,
	TransactionHost: class {},
	ClsPluginTransactional: class {
		constructor(_config: unknown) {}
	},
}));
vi.mock("@nestjs-cls/transactional-adapter-typeorm", () => ({
	TransactionalAdapterTypeOrm: class {
		constructor(_config: unknown) {}
	},
}));

import type { INestApplication } from "@nestjs/common";
import request from "supertest";
import introspectionQuery from "./graphql/app/introspection.graphql";
import type { TestAppContext } from "./e2e/helpers/create-test-app";
import { createTestApp } from "./e2e/helpers/create-test-app";

let ctx: TestAppContext;
let app: INestApplication;

beforeAll(async () => {
	ctx = await createTestApp();
	app = ctx.app;
});

afterAll(async () => app.close());

describe("App bootstrap", () => {
	it("GraphQL endpoint responds to introspection", async () => {
		const res = await request(app.getHttpServer())
			.post("/graphql")
			.send({ query: introspectionQuery });

		expect(res.status).toBe(200);
		expect(res.body.data.__typename).toBe("Query");
	});

	it("unknown routes return 404", async () => {
		const res = await request(app.getHttpServer()).get("/unknown-route");
		expect(res.status).toBe(404);
	});
});
