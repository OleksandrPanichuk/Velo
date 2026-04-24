import "reflect-metadata";
import {config as loadEnv} from "dotenv";
import {DataSource} from "typeorm";
import {envSchema} from "./src/config/env.config";

const nodeEnv = process.env.NODE_ENV ?? "development";
loadEnv({path: `.env.${nodeEnv}`});

const env = envSchema.parse(process.env);

export default new DataSource({
    type: "postgres",
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    entities: [__dirname + "/src/**/*{.entity,.model}{.ts,.js}"],
    migrations: [__dirname + "/migrations/*{.ts,.js}"],
    synchronize: false,
});
