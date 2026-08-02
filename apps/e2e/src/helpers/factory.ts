let counter = 0;

function unique(prefix: string) {
	counter += 1;
	return `${prefix}-${process.pid}-${Date.now().toString(36)}-${counter}`;
}

export const TEST_PASSWORD = "Password123!";

export interface TestUserInput {
	email: string;
	username: string;
	fullName: string;
	password: string;
}

export function buildUser(overrides: Partial<TestUserInput> = {}): TestUserInput {
	const id = unique("user");

	return {
		email: `${id}@velo.test`,
		username: id.replace(/-/g, "").slice(0, 30),
		fullName: "Test Person",
		password: TEST_PASSWORD,
		...overrides,
	};
}

export function buildWorkspace(overrides: Partial<{ name: string; slug: string }> = {}) {
	const id = unique("ws").toLowerCase();

	return {
		name: `Workspace ${id.replace(/-/g, " ")}`,
		slug: id,
		...overrides,
	};
}
