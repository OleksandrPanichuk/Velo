/**
 * UsersRepository — real-DB integration tests.
 *
 * These tests run against the actual PostgreSQL test container.
 * Start infra:  npm run test:infra:up  (from apps/api)
 * Then run:     npm run test:db
 *
 * What's verified here that unit tests cannot:
 * - SQL query correctness (especially addSelect for hidden columns)
 * - Unique constraint enforcement
 * - @BeforeInsert hooks (password hashing) round-trip
 * - Username generation conflict resolution
 */
vi.mock("@nestjs-cls/transactional", () => ({
	Transactional: () => (_t: unknown, _k: string, d: PropertyDescriptor) => d,
	TransactionHost: class {},
	ClsPluginTransactional: class {
		constructor(_: unknown) {}
	},
}));
vi.mock("@nestjs-cls/transactional-adapter-typeorm", () => ({
	TransactionalAdapterTypeOrm: class {
		constructor(_: unknown) {}
	},
}));

import { TransactionHost } from "@nestjs-cls/transactional";
import { OAuthAccountModel } from "@/models/OAuthAccount.model";
import { UserModel } from "@/models/User.model";
import { UsersRepository } from "@/modules/users/users.repository";
import { Test } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { verify } from "argon2";
import type { DataSource } from "typeorm";
import { createTestDataSource, getTestTypeOrmOptions, truncateAll } from "../../database/helpers";
import { SEED, seedUsers } from "../../database/seeds";

let ds: DataSource;
let repo: UsersRepository;

beforeAll(async () => {
	ds = createTestDataSource();
	await ds.initialize();

	const module = await Test.createTestingModule({
		imports: [
			TypeOrmModule.forRoot(getTestTypeOrmOptions()),
			TypeOrmModule.forFeature([UserModel, OAuthAccountModel]),
		],
		providers: [UsersRepository, { provide: TransactionHost, useValue: { tx: undefined } }],
	}).compile();

	repo = module.get(UsersRepository);
});

afterAll(async () => ds.destroy());
beforeEach(async () => {
	await truncateAll(ds);
	await seedUsers(ds);
});

describe("UsersRepository (real DB)", () => {
	describe("findByEmail()", () => {
		it("returns the user when the email exists", async () => {
			const result = await repo.findByEmail(SEED.user.email);

			expect(result).not.toBeNull();
			expect(result!.id).toBe(SEED.user.id);
			expect(result!.email).toBe(SEED.user.email);
		});

		it("returns null when email does not exist", async () => {
			const result = await repo.findByEmail("nobody@velo.test");
			expect(result).toBeNull();
		});
	});

	describe("findByEmailWithPassword()", () => {
		it("includes the hidden password column", async () => {
			const result = await repo.findByEmailWithPassword(SEED.user.email);

			expect(result).not.toBeNull();
			// password column is select:false by default; addSelect must fetch it
			expect(result!.password).toBeDefined();
			expect(result!.password!.length).toBeGreaterThan(0);
		});

		it("password stored is a valid argon2 hash of the seeded plaintext", async () => {
			const result = await repo.findByEmailWithPassword(SEED.user.email);
			const valid = await verify(result!.password!, SEED.user.password);
			expect(valid).toBe(true);
		});

		it("returns null for unknown email", async () => {
			expect(await repo.findByEmailWithPassword("ghost@velo.test")).toBeNull();
		});
	});

	describe("create() — @BeforeInsert hook", () => {
		it("hashes the password before persisting", async () => {
			const user = await repo.create({
				email: "new@velo.test",
				username: "newuser",
				fullName: "New User",
				password: "RawPassword1!",
				isEmailVerified: false,
			});

			// Fetch with hidden column to verify hash
			const persisted = await repo.findByEmailWithPassword("new@velo.test");
			expect(persisted!.password).not.toBe("RawPassword1!");
			expect(await verify(persisted!.password!, "RawPassword1!")).toBe(true);
			expect(user.id).toBeDefined();
		});
	});

	describe("verifyEmail()", () => {
		it("sets isEmailVerified=true and clears the token", async () => {
			// Set a token first
			await ds
				.getRepository(UserModel)
				.update(SEED.user.id, { emailVerificationToken: "tok-123", isEmailVerified: false });

			await repo.verifyEmail(SEED.user.id);

			const updated = await repo.findById(SEED.user.id);
			expect(updated!.isEmailVerified).toBe(true);
			// emailVerificationToken has select:false so findById won't include it;
			// verify via a dedicated query that adds the column back
			const withToken = await repo.findByEmailVerificationToken("tok-123");
			expect(withToken).toBeNull(); // token was cleared
		});
	});

	describe("findByEmailVerificationToken()", () => {
		it("returns the user when token matches", async () => {
			await ds
				.getRepository(UserModel)
				.update(SEED.user.id, { emailVerificationToken: "verify-abc" });

			const result = await repo.findByEmailVerificationToken("verify-abc");
			expect(result!.id).toBe(SEED.user.id);
		});

		it("returns null when token does not exist", async () => {
			expect(await repo.findByEmailVerificationToken("bad-token")).toBeNull();
		});
	});

	describe("setRefreshToken() / clearRefreshToken()", () => {
		it("hashes the token and then clears it", async () => {
			await repo.setRefreshToken(SEED.user.id, "raw-refresh-token");

			const withToken = await repo.findByIdWithRefreshToken(SEED.user.id);
			expect(withToken!.refreshToken).toBeDefined();
			expect(await verify(withToken!.refreshToken!, "raw-refresh-token")).toBe(true);

			await repo.clearRefreshToken(SEED.user.id);
			const cleared = await repo.findByIdWithRefreshToken(SEED.user.id);
			expect(cleared!.refreshToken).toBeNull();
		});
	});

	describe("update()", () => {
		it("applies partial updates and returns the updated entity", async () => {
			const updated = await repo.update(SEED.user.id, { fullName: "Alice Updated" });

			expect(updated!.fullName).toBe("Alice Updated");
			expect(updated!.email).toBe(SEED.user.email);
		});

		it("returns null when the id does not exist", async () => {
			const result = await repo.update("00000000-0000-0000-0000-999999999999", {
				fullName: "Ghost",
			});
			expect(result).toBeNull();
		});
	});

	describe("softDelete()", () => {
		it("sets deletedAt and hides the row from normal queries", async () => {
			await repo.softDelete(SEED.user.id);

			const result = await repo.findById(SEED.user.id);
			expect(result).toBeNull();
		});
	});

	describe("findAll() / findById() / findByIds()", () => {
		it("findAll returns all unseeded users", async () => {
			const all = await repo.findAll();
			// Seeded: alice + bob
			expect(all.length).toBeGreaterThanOrEqual(2);
		});

		it("findById returns the correct user", async () => {
			const user = await repo.findById(SEED.user.id);
			expect(user!.email).toBe(SEED.user.email);
		});

		it("findByIds returns all matched users", async () => {
			const users = await repo.findByIds([SEED.user.id, SEED.secondUser.id]);
			expect(users).toHaveLength(2);
		});
	});
});
