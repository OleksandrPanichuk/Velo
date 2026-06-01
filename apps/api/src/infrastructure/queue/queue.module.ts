import { Global, Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { ConfigService } from "@nestjs/config";
import { Env } from "@/config";

@Global()
@Module({
	imports: [
		BullModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService<Env>) => ({
				connection: {
					host: config.getOrThrow<string>("REDIS_HOST"),
					port: config.getOrThrow<number>("REDIS_PORT"),
				},
			}),
		}),
	],
	exports: [BullModule],
})
export class QueueModule {}
