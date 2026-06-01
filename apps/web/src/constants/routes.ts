export const ROUTES = {
	root: "/",
	auth: {
		login: "/login",
		register: "/register",
		forgotPassword: "/forgot-password",
		resetPassword: "/reset-password",
		verifyEmail: "/verify-email",
		invite: "/invite",
	},
	onboarding: "/onboarding",
	settings: {
		profile: "/settings/profile",
	},
	workspace: {
		root: (slug: string) => `/${slug}`,
	},
} as const;

export const API_ROUTES = {
	auth: {
		oauth: (provider: string) => `/auth/${provider.toLowerCase()}`,
	},
};
