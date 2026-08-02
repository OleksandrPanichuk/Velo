import { expect, type Page } from "@playwright/test";

import { WorkspaceSidebarHarness } from "@web/features/workspace/ui/components/WorkspaceSidebar/WorkspaceSidebar.harness";
import { WorkspaceSwitcherHarness } from "@web/features/workspace/ui/components/WorkspaceSwitcher.harness";
import { WorkspaceUserMenuHarness } from "@web/features/workspace/ui/components/WorkspaceUserMenu.harness";

import { byQa } from "@/helpers/qa";
import { BasePage } from "@/pages/base.page";

export class WorkspaceShell extends BasePage {
	protected readonly path = "/";

	private readonly sidebar = byQa(this.page, WorkspaceSidebarHarness.Root);
	private readonly navLinks = byQa(this.page, WorkspaceSidebarHarness.NavLink);
	private readonly navPlaceholders = byQa(this.page, WorkspaceSidebarHarness.NavPlaceholder);
	private readonly switcherTrigger = byQa(this.page, WorkspaceSwitcherHarness.Trigger);
	private readonly switcherName = byQa(this.page, WorkspaceSwitcherHarness.Name);
	private readonly switcherOptions = byQa(this.page, WorkspaceSwitcherHarness.Option);
	private readonly userMenuTrigger = byQa(this.page, WorkspaceUserMenuHarness.Trigger);
	private readonly signOutItem = byQa(this.page, WorkspaceUserMenuHarness.SignOut);

	constructor(page: Page) {
		super(page);
	}

	async gotoWorkspace(slug: string) {
		await this.goto(`/${slug}`);
	}

	async gotoInbox(slug: string) {
		await this.goto(`/${slug}/inbox`);
	}

	async gotoMembers(slug: string) {
		await this.goto(`/${slug}/members`);
	}

	async gotoSettings(slug: string) {
		await this.goto(`/${slug}/settings`);
	}

	async clickNav(label: string) {
		await this.navLinks.filter({ hasText: label }).click();
	}

	async openSwitcher() {
		await this.switcherTrigger.click();
	}

	async switchToWorkspace(name: string) {
		await this.openSwitcher();
		await this.chooseWorkspace(name);
	}

	async chooseWorkspace(name: string) {
		await this.switcherOptions.filter({ hasText: name }).click();
	}

	async signOut() {
		await this.userMenuTrigger.click();
		await this.signOutItem.click();
	}

	async expectLoaded() {
		await this.expectVisible(this.sidebar);
	}

	async expectWorkspaceName(name: string) {
		await expect(this.switcherName).toHaveText(name);
	}

	async expectInsideWorkspace(slug: string) {
		await expect(this.page).toHaveURL(new RegExp(`/${slug}(/|$)`), { timeout: 30_000 });
		await this.expectLoaded();
	}

	async expectOnInbox(slug: string) {
		await this.expectAt(`/${slug}/inbox`);
	}

	async expectOnMembers(slug: string) {
		await this.expectAt(`/${slug}/members`);
	}

	async expectOnSettings(slug: string) {
		await this.expectAt(`/${slug}/settings`);
	}

	async expectActiveNav(label: string) {
		await expect(this.navLinks.filter({ hasText: label })).toHaveAttribute("aria-current", "page");
	}

	async expectInactiveNav(label: string) {
		await expect(this.navLinks.filter({ hasText: label })).not.toHaveAttribute(
			"aria-current",
			"page",
		);
	}

	async expectPlaceholderDisabled(label: string) {
		const placeholder = this.navPlaceholders.filter({ hasText: label });

		await expect(placeholder).toBeVisible();
		await expect(placeholder).toHaveAttribute("aria-disabled", "true");
		await expect(placeholder).not.toHaveRole("link");
	}

	async expectPlaceholderNotInteractive(label: string) {
		const placeholder = this.navPlaceholders.filter({ hasText: label });

		await this.expectPlaceholderDisabled(label);
		await expect(placeholder).not.toHaveRole("button");
		await expect(placeholder).not.toHaveAttribute("tabindex", /.*/);
		await expect(placeholder.locator("a, button, [tabindex], [href]")).toHaveCount(0);
		await expect(this.sidebar.getByRole("link", { name: label })).toHaveCount(0);
		await expect(this.sidebar.getByRole("button", { name: label })).toHaveCount(0);
	}

	async expectNoNavLink(label: string) {
		await expect(this.navLinks.filter({ hasText: label })).toHaveCount(0);
	}

	async expectSwitcherLists(names: string[]) {
		await this.openSwitcher();

		for (const name of names) {
			await expect(this.switcherOptions.filter({ hasText: name })).toBeVisible();
		}
	}
}
