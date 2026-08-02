import type { Locator, Page } from "@playwright/test";

export function qaSelector(value: string) {
	return `[data-qa="${value}"]`;
}

export function byQa(scope: Page | Locator, value: string) {
	return scope.locator(qaSelector(value));
}
