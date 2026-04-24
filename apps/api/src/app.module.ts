import {
	type Env,
	envSchema,
	getCacheConfig,
	getGraphQLConfig,
	getThrottlerConfig,
	getTypeOrmConfig,
} from "@/config";
import { NodeEnv } from "@/constants";
import { DataLoaderInterceptor } from "@/infrastructure/dataloader";
import { LoggerInterceptor, LoggerModule } from "@/infrastructure/logger";
import { AppExceptionFilter } from "@/shared/filters";
import { GqlThrottlerGuard } from "@/shared/guards";
import { SecurityHeadersMiddleware } from "@/shared/middlewares";
import { PaginationModule } from "@/shared/pagination";
import { SanitizationPipe } from "@/shared/pipes";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { CacheInterceptor, CacheModule } from "@nestjs/cache-manager";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { GraphQLModule } from "@nestjs/graphql";
import { ThrottlerModule } from "@nestjs/throttler";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CsrfFilter } from "ncsrf/dist";
import { AuthModule } from "@/modules/auth/auth.module";
import { UsersModule } from "@/modules/users/users.module";

@Module({
	imports: [
		AuthModule,
		CacheModule.registerAsync({
			isGlobal: true,
			useFactory: (config: ConfigService<Env>) => getCacheConfig(config),
			inject: [ConfigService],
		}),
		ConfigModule.forRoot({
			envFilePath: `.env.${process.env.NODE_ENV || NodeEnv.DEVELOPMENT}`,
			isGlobal: true,
			validate: (config) => envSchema.parse(config),
		}),
		GraphQLModule.forRootAsync<ApolloDriverConfig>({
			driver: ApolloDriver,
			useFactory: () => getGraphQLConfig(),
		}),
		LoggerModule,
		PaginationModule,
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
			useClass: CacheInterceptor
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
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(SecurityHeadersMiddleware).forRoutes("*");
	}
}
