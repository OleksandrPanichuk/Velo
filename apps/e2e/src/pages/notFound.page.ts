import { expect, type Page } from "@playwright/test";

import { WorkspaceNotFoundHarness } from "@web/app/[workspaceSlug]/not-found.harness";
import { NotFoundHarness } from "@web/app/not-found.harness";

import { byQa } from "@/helpers/qa";
import { BasePage } from "@/pages/base.page";

export class NotFoundPage extends BasePage {
	protected readonly path = "/";

	private readonly root = byQa(this.page, NotFoundHarness.Root);
	private readonly workspaceRoot = byQa(this.page, WorkspaceNotFoundHarness.Root);

	constructor(page: Page) {
		super(page);
	}

	async expectShown() {
		await expect(this.root.or(this.workspaceRoot)).toBeVisible();
	}

	async expectWorkspaceNotFound() {
		await this.expectVisible(this.workspaceRoot);
	}
}
