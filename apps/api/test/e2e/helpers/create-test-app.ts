/**
 * Creates a fully-wired NestJS application for e2e tests.
 *
 * Does NOT import AppModule to avoid real TypeORM/Redis/SMTP connections.
 * Instead, the full HTTP+GraphQL pipeline is assembled manually:
 *   - Real guards, pipes, filters, interceptors
 *   - Real resolvers and services
 *   - Mocked repositories and external infrastructure
 */
import type { INestApplication } from "@nestjs/common";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { GraphQLModule } from "@nestjs/graphql";
import { JwtModule } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { ThrottlerModule } from "@nestjs/throttler";
import cookieParser from "cookie-parser";
import { ClsGuard, ClsModule } from "nestjs-cls";
import { DateTimeResolver, EmailAddressResolver, UUIDResolver } from "graphql-scalars";
import { ApolloDriver, type ApolloDriverConfig } from "@nestjs/apollo";
import { ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { EventEmitterModule } from "@nestjs/event-emitter";

import { AppClsService } from "@/infrastructure/cls";
import { DataLoaderInterceptor } from "@/infrastructure/dataloader";
import { PUBSUB } from "@/infrastructure/pubsub/pubsub.constants";
import { JwtAccessGuard, JwtRefreshGuard } from "@/modules/auth/auth.guards";
import { AuthResolver } from "@/modules/auth/auth.resolver";
import { AuthService } from "@/modules/auth/auth.service";
import {
	GithubStrategy,
	GoogleStrategy,
	JwtAccessStrategy,
	JwtRefreshStrategy,
} from "@/modules/auth/auth.strategies";
import { NotificationsRepository } from "@/modules/notifications/notifications.repository";
import { NotificationsResolver } from "@/modules/notifications/notifications.resolver";
import { NotificationsService } from "@/modules/notifications/notifications.service";
import { PermissionsRepository } from "@/modules/permissions/permissions.repository";
import { PermissionService } from "@/modules/permissions/permissions.service";
import { PoliciesGuard } from "@/modules/permissions/guards/policies.guard";
import { WorkspaceContextGuard } from "@/modules/permissions/guards/workspace-context.guard";
import { UsersLoader } from "@/modules/users/users.loader";
import { UsersRepository } from "@/modules/users/users.repository";
import { UsersResolver } from "@/modules/users/users.resolver";
import { UsersService } from "@/modules/users/users.service";
import { WorkspaceMembersRepository } from "@/modules/workspace-members/workspace-members.repository";
import { WorkspaceMembersService } from "@/modules/workspace-members/workspace-members.service";
import { WorkspacesRepository } from "@/modules/workspaces/workspaces.repository";
import { WorkspacesResolver } from "@/modules/workspaces/workspaces.resolver";
import { WorkspacesService } from "@/modules/workspaces/workspaces.service";
import { AppExceptionFilter } from "@/shared/filters";
import { AppAuthGuard, AppThrottlerGuard } from "@/shared/guards";
import { ResponseCaptureInterceptor } from "@/shared/interceptors";
import { CurrentUserPipe, OptionalCurrentUserPipe, SanitizationPipe } from "@/shared/pipes";
import { PaginationService } from "@/shared/pagination";
import { MailQueue } from "@/queues/mail";
import type { Mocked } from "vitest";
import {
	mockMailQueue,
	mockNotificationsRepository,
	mockPermissionsRepository,
	mockUsersRepository,
	mockWorkspaceMembersRepository,
	mockWorkspacesRepository,
} from "../../helpers/mocks";
import { TEST_JWT_SECRET, TEST_REFRESH_SECRET } from "../../helpers/auth.helper";

/** Sets all required env vars before ConfigModule parses them. */
function applyTestEnv() {
	process.env.NODE_ENV = "test";
	process.env.WEB_URL = "http://localhost:3000";
	process.env.BASE_URL = "http://localhost:8080";
	process.env.JWT_ACCESS_SECRET = TEST_JWT_SECRET;
	process.env.JWT_REFRESH_SECRET = TEST_REFRESH_SECRET;
	process.env.JWT_ACCESS_EXPIRATION = 900;
	process.env.JWT_REFRESH_EXPIRATION = 604800;
	process.env.CLIENT_EMAIL_VERIFICATION_URL = "http://localhost:3000/verify-email";
	process.env.CLIENT_RESET_PASSWORD_URL = "http://localhost:3000/reset-password";
	process.env.GOOGLE_CLIENT_ID = "google-test-id";
	process.env.GOOGLE_CLIENT_SECRET = "google-test-secret";
	process.env.GOOGLE_CALLBACK_URL = "http://localhost:8080/api/auth/google/callback";
	process.env.GITHUB_CLIENT_ID = "github-test-id";
	process.env.GITHUB_CLIENT_SECRET = "github-test-secret";
	process.env.GITHUB_CALLBACK_URL = "http://localhost:8080/api/auth/github/callback";
	process.env.OAUTH_SUCCESS_REDIRECT = "http://localhost:3000/auth/success";
	process.env.OAUTH_FAILURE_REDIRECT = "http://localhost:3000/auth/error";
}

export interface TestAppContext {
	app: INestApplication;
	usersRepo: Mocked<UsersRepository>;
	wsRepo: Mocked<WorkspacesRepository>;
	wmRepo: Mocked<WorkspaceMembersRepository>;
	notifRepo: Mocked<NotificationsRepository>;
	permRepo: Mocked<PermissionsRepository>;
	mailQueue: Mocked<MailQueue>;
	pubSub: { publish: ReturnType<typeof vi.fn>; asyncIterator: ReturnType<typeof vi.fn> };
}

export async function createTestApp(): Promise<TestAppContext> {
	applyTestEnv();

	const usersRepo = mockUsersRepository();
	const wsRepo = mockWorkspacesRepository();
	const wmRepo = mockWorkspaceMembersRepository();
	const notifRepo = mockNotificationsRepository();
	const permRepo = mockPermissionsRepository();
	const mailQueue = mockMailQueue();
	const pubSub = { publish: vi.fn(), asyncIterator: vi.fn() };

	const moduleFixture = await Test.createTestingModule({
		imports: [
			ConfigModule.forRoot({ isGlobal: true }),
			ClsModule.forRoot({ global: true, guard: { mount: false, generateId: true } }),
			PassportModule,
			JwtModule.register({}),
			ThrottlerModule.forRoot([{ ttl: 60_000, limit: 1000 }]),
			EventEmitterModule.forRoot({ wildcard: true, delimiter: "." }),
			GraphQLModule.forRoot<ApolloDriverConfig>({
				driver: ApolloDriver,
				autoSchemaFile: true,
				sortSchema: true,
				context: ({ req, res }) => ({ req, res }),
				resolvers: {
					DateTime: DateTimeResolver,
					EmailAddress: EmailAddressResolver,
					UUID: UUIDResolver,
				},
			}),
		],
		providers: [
			// Repositories (mocked)
			{ provide: UsersRepository, useValue: usersRepo },
			{ provide: WorkspacesRepository, useValue: wsRepo },
			{ provide: WorkspaceMembersRepository, useValue: wmRepo },
			{ provide: NotificationsRepository, useValue: notifRepo },
			{ provide: PermissionsRepository, useValue: permRepo },

			// Infrastructure mocks
			{ provide: MailQueue, useValue: mailQueue },
			{ provide: PUBSUB, useValue: pubSub },

			// CLS service (real, wraps ClsService from ClsModule above)
			AppClsService,

			// Auth
			JwtAccessGuard,
			JwtRefreshGuard,
			JwtAccessStrategy,
			JwtRefreshStrategy,
			GithubStrategy,
			GoogleStrategy,

			// Permissions
			PermissionService,
			WorkspaceContextGuard,
			PoliciesGuard,

			// Pipes needed by resolvers
			CurrentUserPipe,
			OptionalCurrentUserPipe,

			// Services
			UsersService,
			UsersLoader,
			AuthService,
			WorkspacesService,
			WorkspaceMembersService,
			NotificationsService,
			PaginationService,

			// Resolvers
			AuthResolver,
			UsersResolver,
			WorkspacesResolver,
			NotificationsResolver,

			// APP_GUARD chain (order matches AppModule)
			{ provide: APP_GUARD, useClass: ClsGuard },
			{ provide: APP_GUARD, useClass: AppAuthGuard },
			{ provide: APP_GUARD, useExisting: WorkspaceContextGuard },
			{ provide: APP_GUARD, useExisting: PoliciesGuard },
			{ provide: APP_GUARD, useClass: AppThrottlerGuard },

			// Interceptors
			{ provide: APP_INTERCEPTOR, useClass: ResponseCaptureInterceptor },
			{ provide: APP_INTERCEPTOR, useClass: DataLoaderInterceptor },

			// Pipe
			{ provide: APP_PIPE, useClass: SanitizationPipe },

			// Filter
			{ provide: APP_FILTER, useClass: AppExceptionFilter },
		],
	}).compile();

	const app = moduleFixture.createNestApplication();
	app.use(cookieParser());

	await app.init();

	return { app, usersRepo, wsRepo, wmRepo, notifRepo, permRepo, mailQueue, pubSub };
}
