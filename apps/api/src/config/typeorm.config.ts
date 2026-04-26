import type { Env } from "@/config";
import { NodeEnv } from "@repo/primitives";
import { type ConfigService } from "@nestjs/config";
import { type TypeOrmModuleOptions } from "@nestjs/typeorm";

export const getTypeOrmConfig = (config: ConfigService<Env>): TypeOrmModuleOptions => ({
	type: "postgres",
	host: config.get("DB_HOST"),
	port: config.get("DB_PORT"),
	username: config.get("DB_USERNAME"),
	password: config.get("DB_PASSWORD"),
	database: config.get("DB_NAME"),
	entities: [`${__dirname}/**/*.{entity,model}{.ts,.js}`],
	synchronize: config.get("NODE_ENV") !== NodeEnv.PRODUCTION,
});
