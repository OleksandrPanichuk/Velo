import { createTestDataSource } from "./data-source";

export async function setup(): Promise<void> {
	const ds = createTestDataSource();
	await ds.initialize();
	await ds.runMigrations();
	console.log("\n[test:db] Migrations applied — ready\n");
	await ds.destroy();
}
