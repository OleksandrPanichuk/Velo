import { expect, type Locator, type Page } from "@playwright/test";

export abstract class BasePage {
	constructor(protected readonly page: Page) {}

	protected abstract readonly path: string;

	async goto(path = this.path) {
		await this.page.goto(path);
	}

	async expectAt(path = this.path) {
		await expect(this.page).toHaveURL(path);
	}

	async expectVisible(locator: Locator) {
		await expect(locator).toBeVisible();
	}

	async expectText(text: string | RegExp) {
		await expect(this.page.getByText(text)).toBeVisible();
	}
}
