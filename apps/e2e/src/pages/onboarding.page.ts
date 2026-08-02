import { expect, type Page } from "@playwright/test";

import { FORM_ERRORS } from "@web/constants/form-errors";
import { AboutStepHarness } from "@web/features/onboarding/ui/components/AboutStep.harness";
import { ReadyStepHarness } from "@web/features/onboarding/ui/components/ReadyStep.harness";
import { WorkspaceStepHarness } from "@web/features/onboarding/ui/components/WorkspaceStep.harness";
import { OnboardingViewHarness } from "@web/features/onboarding/ui/views/OnboardingView/OnboardingView.harness";

import { byQa } from "@/helpers/qa";
import { BasePage } from "@/pages/base.page";

export class OnboardingPage extends BasePage {
	protected readonly path = "/onboarding";

	private readonly root = byQa(this.page, OnboardingViewHarness.Root);
	private readonly workspaceStep = byQa(this.page, WorkspaceStepHarness.Root);
	private readonly name = byQa(this.page, WorkspaceStepHarness.Name);
	private readonly slug = byQa(this.page, WorkspaceStepHarness.Slug);
	private readonly workspaceContinue = byQa(this.page, WorkspaceStepHarness.Continue);
	private readonly aboutStep = byQa(this.page, AboutStepHarness.Root);
	private readonly roleOptions = byQa(this.page, AboutStepHarness.RoleOption);
	private readonly teamSizeOptions = byQa(this.page, AboutStepHarness.TeamSizeOption);
	private readonly aboutContinue = byQa(this.page, AboutStepHarness.Continue);
	private readonly readyStep = byQa(this.page, ReadyStepHarness.Root);
	private readonly complete = byQa(this.page, ReadyStepHarness.Complete);
	private readonly slugError = byQa(this.page, WorkspaceStepHarness.SlugError);

	constructor(page: Page) {
		super(page);
	}

	async gotoRoot() {
		await super.goto("/");
	}

	async fillWorkspace(name: string, slug?: string) {
		await this.name.fill(name);

		if (slug) await this.slug.fill(slug);
	}

	async continueFromWorkspace() {
		await this.workspaceContinue.click();
	}

	async readSlug() {
		return this.slug.inputValue();
	}

	async chooseRole(label: string) {
		await this.roleOptions.filter({ hasText: label }).click();
	}

	async chooseTeamSize(label: string) {
		await this.teamSizeOptions.filter({ hasText: label }).click();
	}

	async chooseFirstRole() {
		await this.roleOptions.first().click();
	}

	async chooseFirstTeamSize() {
		await this.teamSizeOptions.first().click();
	}

	async continueFromAbout() {
		await this.aboutContinue.click();
	}

	async finish() {
		await this.complete.click();
	}

	async expectLoaded() {
		await this.expectVisible(this.root);
	}

	async expectOnWorkspaceStep() {
		await this.expectVisible(this.workspaceStep);
	}

	async expectOnAboutStep() {
		await this.expectVisible(this.aboutStep);
	}

	async expectOnReadyStep() {
		await this.expectVisible(this.readyStep);
	}

	async expectSlugDerivedFrom(expected: string) {
		await expect(this.slug).toHaveValue(expected);
	}

	async expectSlugEmpty() {
		await expect(this.slug).toHaveValue("");
	}

	async expectNotOnAboutStep() {
		await expect(this.aboutStep).toHaveCount(0);
	}

	async expectReadyForSlug(slug: string) {
		await this.expectVisible(this.readyStep);
		await expect(this.readyStep).toContainText(`${slug}.velo.app`);
	}

	async expectValidationError() {
		await this.expectVisible(this.workspaceStep);
		await expect(this.page.getByText(/required|invalid|at least/i).first()).toBeVisible();
	}

	async expectRequiredErrors() {
		await this.expectVisible(this.workspaceStep);
		await expect(this.name).toHaveAttribute("aria-invalid", "true");
		await expect(this.workspaceStep.getByText(FORM_ERRORS.workspace.name.required)).toBeVisible();
		await expect(this.slugError).toHaveText(FORM_ERRORS.workspace.slug.required);
	}

	async expectNameFormatError() {
		await this.expectVisible(this.workspaceStep);
		await expect(this.name).toHaveAttribute("aria-invalid", "true");
		await expect(this.workspaceStep.getByText(FORM_ERRORS.workspace.name.format)).toBeVisible();
	}
}
