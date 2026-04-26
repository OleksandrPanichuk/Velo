import { Env, getCacheConfig } from "@/config";
import { CacheModule as CacheModuleNest } from "@nestjs/cache-manager";
import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CacheService } from "./cache.service";

@Global()
@Module({
	imports: [
		CacheModuleNest.registerAsync({
			isGlobal: true,
			useFactory: (config: ConfigService<Env>) => getCacheConfig(config),
			inject: [ConfigService],
		}),
	],
	providers: [CacheService],
	exports: [CacheService],
})
export class CacheModule {}
