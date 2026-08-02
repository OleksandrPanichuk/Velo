import { expect, type Page } from "@playwright/test";

import { WorkspaceSettingsViewHarness } from "@web/features/workspace/ui/views/WorkspaceSettingsView/WorkspaceSettingsView.harness";

import { WEB_URL } from "@/config";
import { byQa } from "@/helpers/qa";
import { BasePage } from "@/pages/base.page";

export class SettingsPage extends BasePage {
	protected readonly path = "/";

	private readonly root = byQa(this.page, WorkspaceSettingsViewHarness.Root);
	private readonly heading = byQa(this.page, WorkspaceSettingsViewHarness.Heading);
	private readonly readOnlyNotice = byQa(this.page, WorkspaceSettingsViewHarness.ReadOnlyNotice);
	private readonly detailRows = byQa(this.page, WorkspaceSettingsViewHarness.DetailRow);

	constructor(page: Page) {
		super(page);
	}

	async goto(slug: string) {
		await super.goto(`/${slug}/settings`);
	}

	async expectLoaded() {
		await this.expectVisible(this.root);
		await expect(this.heading).toHaveText("Workspace settings");
	}

	async expectDetail(label: string, value: string | RegExp) {
		const row = this.detailRows.filter({
			has: this.page.locator(`[data-qa="${WorkspaceSettingsViewHarness.DetailLabel}"]`, {
				hasText: label,
			}),
		});

		await expect(row).toBeVisible();
		await expect(row.locator(`[data-qa="${WorkspaceSettingsViewHarness.DetailValue}"]`)).toHaveText(
			value,
		);
	}

	async expectWorkspaceName(name: string) {
		await this.expectDetail("Name", name);
	}

	async expectWorkspaceUrl(slug: string) {
		await this.expectDetail("URL", `${WEB_URL.replace(/^https?:\/\//, "")}/${slug}`);
	}

	async expectReadOnlyNotice() {
		await this.expectVisible(this.readOnlyNotice);
		await expect(this.readOnlyNotice).toContainText("Editing is not available yet");
	}

	async expectNoSaveControl() {
		await expect(this.root.getByRole("button", { name: /save|update|edit|rename/i })).toHaveCount(0);
		await expect(this.root.locator("form")).toHaveCount(0);
		await expect(this.root.locator("button[type=submit]")).toHaveCount(0);
		await expect(this.root.getByRole("textbox")).toHaveCount(0);
	}
}
