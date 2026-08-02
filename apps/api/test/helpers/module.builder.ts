/**
 * Fluent builder for NestJS TestingModules.
 *
 * Reduces boilerplate in integration tests by pre-wiring common module
 * imports (Config, JWT, EventEmitter) and letting each test override only
 * what it cares about.
 *
 * Usage:
 *   const module = await new TestModuleBuilder()
 *     .withConfig({ JWT_ACCESS_SECRET: 'secret' })
 *     .withJwt()
 *     .withEventEmitter()
 *     .addProviders([AuthService])
 *     .overrideProvider(UsersRepository, mockUsersRepository())
 *     .compile();
 */
import { type ModuleMetadata, type Provider, type Type } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { JwtModule } from "@nestjs/jwt";
import { Test, type TestingModule } from "@nestjs/testing";
import { TEST_JWT_SECRET, TEST_REFRESH_SECRET } from "./auth.helper";

interface OverrideEntry {
	token: Type | string | symbol;
	value: unknown;
}

export class TestModuleBuilder {
	private readonly imports: NonNullable<ModuleMetadata["imports"]> = [];
	private readonly providers: Provider[] = [];
	private readonly overrides: OverrideEntry[] = [];

	withConfig(env: Record<string, unknown> = {}): this {
		const defaults: Record<string, unknown> = {
			JWT_ACCESS_SECRET: TEST_JWT_SECRET,
			JWT_REFRESH_SECRET: TEST_REFRESH_SECRET,
			CLIENT_EMAIL_VERIFICATION_URL: "http://localhost/verify",
			CLIENT_RESET_PASSWORD_URL: "http://localhost/reset",
			CLIENT_INVITE_URL: "http://localhost/invite",
			NODE_ENV: "test",
			SMTP_FROM: "noreply@test.com",
			SMTP_HOST: "localhost",
			SMTP_PORT: 1025,
			SMTP_SECURE: false,
			SMTP_USER: "user",
			SMTP_PASS: "pass",
		};

		Object.assign(process.env, defaults, env);

		this.imports.push(ConfigModule.forRoot({ ignoreEnvFile: true }));
		return this;
	}

	withJwt(): this {
		this.imports.push(JwtModule.register({}));
		return this;
	}

	withEventEmitter(): this {
		this.imports.push(EventEmitterModule.forRoot({ wildcard: true, delimiter: "." }));
		return this;
	}

	addProviders(providers: Provider[]): this {
		this.providers.push(...providers);
		return this;
	}

	overrideProvider(token: Type | string | symbol, value: unknown): this {
		this.overrides.push({ token, value });
		return this;
	}

	async compile(): Promise<TestingModule> {
		const valueProviders = this.overrides.map(({ token, value }) => ({
			provide: token,
			useValue: value,
		}));

		return Test.createTestingModule({
			imports: this.imports,
			providers: [...this.providers, ...valueProviders],
		}).compile();
	}
}
