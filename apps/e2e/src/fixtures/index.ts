import { test as base } from "@playwright/test";

import { apiFixture } from "@/fixtures/api.fixture";
import { mailFixture } from "@/fixtures/mail.fixture";
import { pagesFixture } from "@/fixtures/pages.fixture";
import { signedInUserFixture } from "@/fixtures/signedInUser.fixture";
import type { Fixtures } from "@/fixtures/types";
import { workspaceFixture } from "@/fixtures/workspace.fixture";

export const test = base.extend<Fixtures>({
	api: apiFixture,
	mail: mailFixture,
	pages: pagesFixture,
	signedInUser: signedInUserFixture,
	workspace: workspaceFixture,
});

export { expect } from "@playwright/test";
export { buildUser, buildWorkspace, TEST_PASSWORD } from "@/helpers/factory";
export type { Fixtures, Pages, SignedInUser, TestWorkspace } from "@/fixtures/types";
