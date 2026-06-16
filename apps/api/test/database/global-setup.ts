/**
 * Vitest globalSetup — runs once in the main process before any test worker starts.
 *
 * Initializes one DataSource to create/synchronize the schema, then destroys it.
 * Individual test files create their own connections via createTestDataSource().
 */
import { createTestDataSource } from "./data-source";

export async function setup(): Promise<void> {
	const ds = createTestDataSource();
	await ds.initialize();
	console.log("\n[test:db] Schema synchronized — ready\n");
	await ds.destroy();
}
