import {
	type Env,
	envSchema,
	getGraphQLConfig,
	getThrottlerConfig,
	getTypeOrmConfig,
} from "@/config";
import { CacheInterceptor, CacheModule } from "@/infrastructure/cache";
import { AppClsModule } from "@/infrastructure/cls";
import { DataLoaderInterceptor } from "@/infrastructure/dataloader";
import { HealthModule } from "@/infrastructure/health";
import { LoggerInterceptor, LoggerModule } from "@/infrastructure/logger";
import { MailerModule } from "@/infrastructure/mailer";
import { PubSubModule } from "@/infrastructure/pubsub";
import { AuthModule } from "@/modules/auth/auth.module";
import { UsersModule } from "@/modules/users/users.module";
import { WorkspacesModule } from "@/modules/workspaces/workspaces.module";
import { PermissionsModule, PoliciesGuard, WorkspaceContextGuard } from "@/modules/permissions";
import { AppExceptionFilter } from "@/shared/filters";
import { AppAuthGuard, AppThrottlerGuard } from "@/shared/guards";
import { ResponseCaptureInterceptor } from "@/shared/interceptors";
import { SecurityHeadersMiddleware } from "@/shared/middlewares";
import { PaginationModule } from "@/shared/pagination";
import { SanitizationPipe } from "@/shared/pipes";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { GraphQLModule } from "@nestjs/graphql";
import { ThrottlerModule } from "@nestjs/throttler";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NodeEnv } from "@repo/primitives";
import { SentryModule } from "@sentry/nestjs/setup";
import { CsrfFilter } from "ncsrf/dist";
import { ClsGuard } from "nestjs-cls";

@Module({
	imports: [
		AppClsModule,
		AuthModule,
		CacheModule,
		ConfigModule.forRoot({
			envFilePath: `.env.${process.env.NODE_ENV || NodeEnv.DEVELOPMENT}`,
			isGlobal: true,
			validate: (config) => envSchema.parse(config),
		}),
		GraphQLModule.forRootAsync<ApolloDriverConfig>({
			driver: ApolloDriver,
			useFactory: () => getGraphQLConfig(),
		}),
		HealthModule,
		LoggerModule,
		MailerModule,
		PaginationModule,
		PubSubModule,
		SentryModule.forRoot(),
		ThrottlerModule.forRootAsync({
			useFactory: (config: ConfigService<Env>) => getThrottlerConfig(config),
			inject: [ConfigService],
		}),
		TypeOrmModule.forRootAsync({
			useFactory: (config: ConfigService<Env>) => getTypeOrmConfig(config),
			inject: [ConfigService],
		}),
		UsersModule,
		WorkspacesModule,
		PermissionsModule,
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ClsGuard,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: ResponseCaptureInterceptor,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: LoggerInterceptor,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: CacheInterceptor,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: DataLoaderInterceptor,
		},
		{
			provide: APP_PIPE,
			useClass: SanitizationPipe,
		},
		{
			provide: APP_FILTER,
			useClass: CsrfFilter,
		},
		{
			provide: APP_FILTER,
			useClass: AppExceptionFilter,
		},
		{
			provide: APP_GUARD,
			useClass: AppAuthGuard,
		},
		{
			provide: APP_GUARD,
			useExisting: WorkspaceContextGuard,
		},
		{
			provide: APP_GUARD,
			useExisting: PoliciesGuard,
		},
		{
			provide: APP_GUARD,
			useClass: AppThrottlerGuard,
		},
	],
})
export class AppModule implements NestModule {
	public configure(consumer: MiddlewareConsumer): void {
		consumer.apply(SecurityHeadersMiddleware).forRoutes(":path");
	}
}
