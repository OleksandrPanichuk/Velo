import { WorkspaceMemberRole } from "@/enums";
import { WorkspaceMemberModel } from "@/models/WorkspaceMember.model";
import { faker } from "@faker-js/faker";
import { UserFactory } from "./user.factory";
import { WorkspaceFactory } from "./workspace.factory";

export const WorkspaceMemberFactory = {
	build(overrides: Partial<WorkspaceMemberModel> = {}): WorkspaceMemberModel {
		return {
			id: faker.string.uuid(),
			workspaceId: faker.string.uuid(),
			userId: faker.string.uuid(),
			role: WorkspaceMemberRole.MEMBER,
			joinedAt: faker.date.past(),
			createdAt: faker.date.past(),
			updatedAt: faker.date.recent(),
			workspace: WorkspaceFactory.build(),
			user: UserFactory.build(),
			...overrides,
		} as WorkspaceMemberModel;
	},

	buildOwner(overrides: Partial<WorkspaceMemberModel> = {}): WorkspaceMemberModel {
		return WorkspaceMemberFactory.build({ role: WorkspaceMemberRole.OWNER, ...overrides });
	},

	buildAdmin(overrides: Partial<WorkspaceMemberModel> = {}): WorkspaceMemberModel {
		return WorkspaceMemberFactory.build({ role: WorkspaceMemberRole.ADMIN, ...overrides });
	},

	buildList(count: number, overrides: Partial<WorkspaceMemberModel> = {}): WorkspaceMemberModel[] {
		return Array.from({ length: count }, () => WorkspaceMemberFactory.build(overrides));
	},
};
