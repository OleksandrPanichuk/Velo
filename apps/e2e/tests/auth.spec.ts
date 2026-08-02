import { buildUser, test } from "@/fixtures";

const VERIFICATION_SUBJECT = "Verify your email address";
const RESET_SUBJECT = "Reset your password";
const NEW_PASSWORD = "FreshPassword456!";
const WRONG_PASSWORD = "WrongPassword123!";

test.describe("registration", () => {
	test("registers through the form, lands on onboarding and receives a verification email", async ({
		mail,
		pages,
	}) => {
		const user = buildUser();

		await pages.register.goto();
		await pages.register.expectLoaded();
		await pages.register.register(user);

		await pages.onboarding.expectAt();
		await pages.onboarding.expectLoaded();
		await pages.onboarding.expectOnWorkspaceStep();

		await mail.waitForEmail(user.email, { subjectContains: VERIFICATION_SUBJECT });
	});

	test("shows a server error when the email is already registered", async ({ api, pages }) => {
		const user = buildUser();
		await api.signUp(user);
		await api.signOut();

		await pages.register.goto();
		await pages.register.expectLoaded();
		await pages.register.register(buildUser({ email: user.email }));

		await pages.register.expectError("Email already in use");
	});
});

test.describe("email verification", () => {
	test("verifies the email with the token from the verification mail", async ({
		api,
		mail,
		pages,
	}) => {
		const user = buildUser();
		await api.signUp(user);

		const token = await mail.waitForToken(user.email, {
			subjectContains: VERIFICATION_SUBJECT,
			urlContains: "verify-email",
		});

		await pages.verifyEmail.gotoWithToken(token);

		await pages.verifyEmail.expectVerified();
		await pages.verifyEmail.expectContinueToSignInAvailable();
	});

	test("shows the failure state for a garbage token", async ({ pages }) => {
		await pages.verifyEmail.gotoWithToken("not-a-real-token");

		await pages.verifyEmail.expectFailed();
	});
});

test.describe("login", () => {
	test("signs in with valid credentials", async ({ api, pages }) => {
		const user = buildUser();
		await api.signUp(user);
		await api.signOut();

		await pages.login.goto();
		await pages.login.expectLoaded();
		await pages.login.signIn(user.email, user.password);

		await pages.onboarding.expectAt();
		await pages.onboarding.expectLoaded();
	});

	test("keeps the user on the login page with an inline error for a wrong password", async ({
		api,
		pages,
	}) => {
		const user = buildUser();
		await api.signUp(user);
		await api.signOut();

		await pages.login.goto();
		await pages.login.expectLoaded();
		await pages.login.signIn(user.email, WRONG_PASSWORD);

		await pages.login.expectError("Invalid credentials");
	});
});

test.describe("logout", () => {
	test("signs out from the workspace shell and drops the session", async ({ pages, workspace }) => {
		await pages.shell.gotoInbox(workspace.slug);
		await pages.shell.expectLoaded();

		await pages.shell.signOut();

		await pages.login.expectAt();
		await pages.login.expectLoaded();

		await pages.shell.gotoInbox(workspace.slug);

		await pages.login.expectAt();
		await pages.login.expectLoaded();
	});
});

test.describe("password reset", () => {
	test("resets the password and only the new one works afterwards", async ({
		api,
		mail,
		pages,
	}) => {
		const user = buildUser();
		await api.signUp(user);
		await api.signOut();

		await pages.forgotPassword.goto();
		await pages.forgotPassword.expectLoaded();
		await pages.forgotPassword.submitEmail(user.email);
		await pages.forgotPassword.expectSubmitted(user.email);

		const token = await mail.waitForToken(user.email, {
			subjectContains: RESET_SUBJECT,
			urlContains: "reset-password",
		});

		await pages.resetPassword.gotoWithToken(token);
		await pages.resetPassword.expectLoaded();
		await pages.resetPassword.resetTo(NEW_PASSWORD);
		await pages.resetPassword.expectSuccess();

		await pages.resetPassword.continueToSignIn();

		await pages.login.expectAt();
		await pages.login.expectLoaded();
		await pages.login.signIn(user.email, user.password);
		await pages.login.expectError("Invalid credentials");

		await pages.login.signIn(user.email, NEW_PASSWORD);

		await pages.onboarding.expectAt();
		await pages.onboarding.expectLoaded();
	});
});

test.describe("route guards", () => {
	test("sends unauthenticated visitors from onboarding to login", async ({ pages }) => {
		await pages.onboarding.goto();

		await pages.login.expectAt();
		await pages.login.expectLoaded();
	});

	test("sends unauthenticated visitors from a workspace url to login", async ({
		api,
		pages,
		workspace,
	}) => {
		await api.signOut();

		await pages.shell.gotoInbox(workspace.slug);

		await pages.login.expectAt();
		await pages.login.expectLoaded();
	});
});
