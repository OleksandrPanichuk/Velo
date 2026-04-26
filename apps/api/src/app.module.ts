import {
	type Env,
	envSchema,
	getGraphQLConfig,
	getThrottlerConfig,
	getTypeOrmConfig,
} from "@/config";
import { CacheModule } from "@/infrastructure/cache";
import { AppClsModule } from "@/infrastructure/cls";
import { DataLoaderInterceptor } from "@/infrastructure/dataloader";
import { HealthModule } from "@/infrastructure/health";
import { LoggerInterceptor, LoggerModule } from "@/infrastructure/logger";
import { PubSubModule } from "@/infrastructure/pubsub";
import { AuthModule } from "@/modules/auth/auth.module";
import { UsersModule } from "@/modules/users/users.module";
import { AppExceptionFilter } from "@/shared/filters";
import { GqlThrottlerGuard } from "@/shared/guards";
import { SecurityHeadersMiddleware } from "@/shared/middlewares";
import { PaginationModule } from "@/shared/pagination";
import { SanitizationPipe } from "@/shared/pipes";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { CacheInterceptor } from "@nestjs/cache-manager";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { GraphQLModule } from "@nestjs/graphql";
import { ThrottlerModule } from "@nestjs/throttler";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NodeEnv } from "@repo/primitives";
import { SentryModule } from "@sentry/nestjs/setup";
import { CsrfFilter } from "ncsrf/dist";

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
	],
	providers: [
		{
			provide: APP_INTERCEPTOR,
			useClass: LoggerInterceptor,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: CacheInterceptor,
		},
		{
			provide: APP_GUARD,
			useClass: GqlThrottlerGuard,
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
			useClass: AppExceptionFilter,
		},
		{
			provide: APP_FILTER,
			useClass: CsrfFilter,
		},
	],
})
export class AppModule implements NestModule {
	public configure(consumer: MiddlewareConsumer): void {
		consumer.apply(SecurityHeadersMiddleware).forRoutes("*path");
	}
}
