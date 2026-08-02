import { expect, type Page } from "@playwright/test";

import { InviteMemberFormHarness } from "@web/features/invite/ui/components/InviteMemberForm.harness";
import { PendingInvitesListHarness } from "@web/features/invite/ui/components/PendingInvitesList.harness";
import { InviteManagementHarness } from "@web/features/invite/ui/views/InviteManagement/InviteManagement.harness";
import { MemberRowHarness } from "@web/features/workspace/ui/components/MemberRow.harness";
import { RoleBadgeHarness } from "@web/features/workspace/ui/components/RoleBadge.harness";
import { MembersViewHarness } from "@web/features/workspace/ui/views/MembersView/MembersView.harness";

import { byQa } from "@/helpers/qa";
import { BasePage } from "@/pages/base.page";

export type InviteRole = "Admin" | "Member" | "Guest";

export class MembersPage extends BasePage {
	protected readonly path = "/";

	private readonly root = byQa(this.page, MembersViewHarness.Root);
	private readonly heading = byQa(this.page, MembersViewHarness.Heading);
	private readonly teamHeading = byQa(this.page, MembersViewHarness.TeamHeading);
	private readonly memberRows = byQa(this.page, MemberRowHarness.Root);
	private readonly inviteSection = byQa(this.page, InviteManagementHarness.Root);
	private readonly inviteEmail = byQa(this.page, InviteMemberFormHarness.Email);
	private readonly inviteRole = byQa(this.page, InviteMemberFormHarness.Role);
	private readonly inviteSubmit = byQa(this.page, InviteMemberFormHarness.Submit);
	private readonly inviteError = byQa(this.page, InviteMemberFormHarness.Error);
	private readonly inviteSuccess = byQa(this.page, InviteMemberFormHarness.Success);
	private readonly inviteForm = byQa(this.page, InviteMemberFormHarness.Form);
	private readonly inviteEmailError = this.inviteForm.locator('p[id$="-error"]');
	private readonly pendingRows = byQa(this.page, PendingInvitesListHarness.Row);
	private readonly pendingEmpty = byQa(this.page, PendingInvitesListHarness.Empty);
	private readonly pendingError = byQa(this.page, PendingInvitesListHarness.Error);

	constructor(page: Page) {
		super(page);
	}

	async goto(slug: string) {
		await super.goto(`/${slug}/members`);
	}

	async invite(email: string, role: InviteRole = "Member") {
		await this.inviteEmail.fill(email);

		if (role !== "Member") {
			await this.inviteRole.click();
			await this.page.getByRole("option", { name: role, exact: true }).click();
		}

		await this.inviteSubmit.click();
	}

	async revokeInvite(email: string) {
		const row = this.pendingRows.filter({ hasText: email });

		await row.locator(`[data-qa="${PendingInvitesListHarness.Revoke}"]`).click();
	}

	async expectLoaded() {
		await this.expectVisible(this.root);
		await expect(this.heading).toHaveText("Members");
	}

	async expectMemberListed(email: string, roleLabel: string) {
		const row = this.memberRows.filter({ hasText: email });

		await expect(row).toBeVisible();
		await expect(row.locator(`[data-qa="${RoleBadgeHarness.Badge}"]`)).toHaveText(roleLabel);
	}

	async expectMemberEmailListed(email: string) {
		const row = this.memberRows.filter({ hasText: email });

		await expect(row.locator(`[data-qa="${MemberRowHarness.Email}"]`)).toHaveText(email);
	}

	async expectMemberCount(count: number) {
		await expect(this.memberRows).toHaveCount(count);
	}

	async expectTeamCount(count: number) {
		await expect(this.teamHeading).toHaveText(`Team (${count})`);
	}

	async expectInviteSectionVisible() {
		await this.expectVisible(this.inviteSection);
	}

	async expectInviteSuccess(email: string) {
		await expect(this.inviteSuccess).toContainText(`Invite sent to ${email}`);
	}

	async expectInviteSectionHidden() {
		await expect(this.inviteSection).toHaveCount(0);
	}

	async expectPendingInvite(email: string) {
		await expect(this.pendingRows.filter({ hasText: email })).toBeVisible();
	}

	async expectNoPendingInvite(email: string) {
		await expect(this.pendingRows.filter({ hasText: email })).toHaveCount(0);
	}

	async expectNoPendingInvites() {
		await this.expectVisible(this.pendingEmpty);
		await expect(this.pendingRows).toHaveCount(0);
	}

	async expectInviteValidationError() {
		await this.expectVisible(this.inviteEmailError);
		await expect(this.inviteEmailError).not.toBeEmpty();
	}

	async expectInviteEmailKept(email: string) {
		await expect(this.inviteEmail).toHaveValue(email);
	}

	async expectNoInviteSuccess() {
		await expect(this.inviteSuccess).toHaveCount(0);
	}

	async expectInviteFormReady() {
		await expect(this.inviteSubmit).toBeEnabled();
	}

	async expectNoError() {
		await expect(this.inviteError).toHaveCount(0);
		await expect(this.pendingError).toHaveCount(0);
	}
}
