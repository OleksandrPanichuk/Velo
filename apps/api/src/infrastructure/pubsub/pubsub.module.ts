import type { Env } from "@/config";
import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RedisPubSub } from "graphql-redis-subscriptions";
import Redis from "ioredis";
import { PUBSUB } from "./pubsub.constants";

@Global()
@Module({
	providers: [
		{
			provide: PUBSUB,
			useFactory: (config: ConfigService<Env>) => {
				const options = {
					host: config.getOrThrow<string>("REDIS_HOST"),
					port: config.getOrThrow<number>("REDIS_PORT"),
				};
				return new RedisPubSub({
					publisher: new Redis(options),
					subscriber: new Redis(options),					
				});
			},
			inject: [ConfigService],
		},
	],
	exports: [PUBSUB],
})
export class PubSubModule {}
