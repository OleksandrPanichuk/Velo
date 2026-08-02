/**
 * Shared utilities for tests that use a real database connection.
 *
 * Usage in a spec file:
 *
 *   let ds: DataSource;
 *
 *   beforeAll(async () => { ds = createTestDataSource(); await ds.initialize(); });
 *   afterAll(async ()  => { await ds.destroy(); });
 *   beforeEach(async () => { await truncateAll(ds); });
 */
import type { DataSource } from "typeorm";
import type { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { TEST_ENTITIES } from "./data-source";

export { createTestDataSource, TEST_ENTITIES } from "./data-source";

/**
 * Plain TypeORM connection options for use with TypeOrmModule.forRoot() in NestJS test modules.
 * Uses explicit entity classes so TypeORM doesn't try to load raw .ts files via Node.js.
 */
export function getTestTypeOrmOptions(): TypeOrmModuleOptions {
	return {
		type: "postgres",
		host: process.env.DB_HOST ?? "localhost",
		port: Number(process.env.DB_PORT ?? 5433),
		username: process.env.DB_USERNAME ?? "postgres",
		password: process.env.DB_PASSWORD ?? "postgres",
		database: process.env.DB_NAME ?? "velo_test",
		entities: TEST_ENTITIES,
		synchronize: false,
		logging: false,
	};
}

/**
 * Truncates every entity table in the test database.
 * Uses CASCADE so FK order doesn't matter.
 */
export async function truncateAll(dataSource: DataSource): Promise<void> {
	if (!dataSource.entityMetadatas.length) return;

	const tables = dataSource.entityMetadatas.map((e) => `"${e.tableName}"`).join(", ");

	await dataSource.query(`TRUNCATE TABLE ${tables} CASCADE`);
}
