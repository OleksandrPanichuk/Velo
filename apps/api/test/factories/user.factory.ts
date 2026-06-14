import { MemberJobRole } from "@/enums";
import { UserModel } from "@/models/User.model";
import { faker } from "@faker-js/faker";

export const UserFactory = {
	build(overrides: Partial<UserModel> = {}): UserModel {
		return {
			id: faker.string.uuid(),
			email: faker.internet.email().toLowerCase(),
			username: faker.internet.username().toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 28),
			fullName: faker.person.fullName(),
			avatarUrl: null,
			timezone: "UTC",
			locale: "en",
			isEmailVerified: false,
			jobRole: null,
			password: null,
			refreshToken: null,
			emailVerificationToken: null,
			passwordResetToken: null,
			passwordResetTokenExpiresAt: null,
			createdAt: faker.date.past(),
			updatedAt: faker.date.recent(),
			deletedAt: null,
			oauthAccounts: [],
			workspaceMembers: [],
			teamMembers: [],
			...overrides,
		} as UserModel;
	},

	buildVerified(overrides: Partial<UserModel> = {}): UserModel {
		return UserFactory.build({ isEmailVerified: true, ...overrides });
	},

	buildWithJobRole(role: MemberJobRole, overrides: Partial<UserModel> = {}): UserModel {
		return UserFactory.build({ jobRole: role, isEmailVerified: true, ...overrides });
	},

	buildList(count: number, overrides: Partial<UserModel> = {}): UserModel[] {
		return Array.from({ length: count }, () => UserFactory.build(overrides));
	},
};
