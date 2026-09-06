import { type WorkspaceSize } from "@/enums";
import { type WorkspaceModel } from "@/models/Workspace.model";
import { faker } from "@faker-js/faker";

export const WorkspaceFactory = {
	build(overrides: Partial<WorkspaceModel> = {}): WorkspaceModel {
		const name = faker.company.name();
		return {
			id: faker.string.uuid(),
			name,
			slug: faker.helpers.slugify(name).toLowerCase(),
			size: null,
			logoId: null,
			logo: null,
			members: [],
			teams: [],
			createdAt: faker.date.past(),
			updatedAt: faker.date.recent(),
			deletedAt: null,
			...overrides,
		};
	},

	buildWithSize(size: WorkspaceSize, overrides: Partial<WorkspaceModel> = {}): WorkspaceModel {
		return WorkspaceFactory.build({ size, ...overrides });
	},

	buildList(count: number, overrides: Partial<WorkspaceModel> = {}): WorkspaceModel[] {
		return Array.from({ length: count }, () => WorkspaceFactory.build(overrides));
	},
};
