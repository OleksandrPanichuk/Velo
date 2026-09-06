import "./instrument";

import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import compression from "compression";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { nestCsrf } from "ncsrf/dist";
import { AppModule } from "./app.module";
import { type Env, getCorsConfig, getHelmetConfig } from "./config";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const config = app.get(ConfigService<Env>);
	const PORT = config.get<number>("PORT", 8080);

	// Cookies and compression
	app.use(compression());
	app.use(cookieParser());

	// Pipes
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
			forbidUnknownValues: true,
		}),
	);

	// Security
	app.enableCors(getCorsConfig(config));
	app.use(helmet(getHelmetConfig(config)));
	app.use(nestCsrf());

	app.setGlobalPrefix("api", { exclude: ["health"] });

	await app.listen(PORT, () => {
		Logger.log(`Listening on port: ${PORT}`, "Bootstrap");
	});
}

void bootstrap();
