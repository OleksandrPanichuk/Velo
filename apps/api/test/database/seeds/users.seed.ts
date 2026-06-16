import { WorkspaceMemberRole } from "@/enums";
import { OAuthAccountModel } from "@/models/OAuthAccount.model";
import { UserModel } from "@/models/User.model";
import { WorkspaceMemberModel } from "@/models/WorkspaceMember.model";
import { WorkspaceModel } from "@/models/Workspace.model";
import type { DataSource } from "typeorm";

// ─── Deterministic test identities ────────────────────────────────────────────
// Fixed UUIDs so tests can reference them without querying the DB first.

export const SEED = {
	user: {
		id: "11111111-1111-1111-1111-111111111111",
		email: "alice@velo.test",
		username: "alice",
		fullName: "Alice Test",
		/** Plain-text password — passed to the model so @BeforeInsert hashes it. */
		password: "Password123!",
	},
	secondUser: {
		id: "22222222-2222-2222-2222-222222222222",
		email: "bob@velo.test",
		username: "bob",
		fullName: "Bob Test",
		password: "Password123!",
	},
	workspace: {
		id: "33333333-3333-3333-3333-333333333333",
		name: "Seed Workspace",
		slug: "seed-workspace",
	},
} as const;

/**
 * Inserts the baseline test records (two users + one workspace + owner membership).
 * Safe to call multiple times — duplicate keys are ignored.
 */
export async function seedUsers(dataSource: DataSource): Promise<void> {
	const userRepo = dataSource.getRepository(UserModel);

	// Build via the model so @BeforeInsert hooks run (password gets hashed).
	const alice = userRepo.create({
		id: SEED.user.id,
		email: SEED.user.email,
		username: SEED.user.username,
		fullName: SEED.user.fullName,
		password: SEED.user.password,
		isEmailVerified: true,
	});

	const bob = userRepo.create({
		id: SEED.secondUser.id,
		email: SEED.secondUser.email,
		username: SEED.secondUser.username,
		fullName: SEED.secondUser.fullName,
		password: SEED.secondUser.password,
		isEmailVerified: true,
	});

	await userRepo.save([alice, bob]);
}

export async function seedWorkspace(dataSource: DataSource): Promise<void> {
	const wsRepo = dataSource.getRepository(WorkspaceModel);
	const wmRepo = dataSource.getRepository(WorkspaceMemberModel);

	const workspace = wsRepo.create({
		id: SEED.workspace.id,
		name: SEED.workspace.name,
		slug: SEED.workspace.slug,
	});
	await wsRepo.save(workspace);

	const member = wmRepo.create({
		workspaceId: SEED.workspace.id,
		userId: SEED.user.id,
		role: WorkspaceMemberRole.OWNER,
	});
	await wmRepo.save(member);
}

/** Seeds all baseline test data (users + workspace). */
export async function seed(dataSource: DataSource): Promise<void> {
	await seedUsers(dataSource);
	await seedWorkspace(dataSource);
}
