import type { Env } from "@/config";
import { type CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import { type ConfigService } from "@nestjs/config";

export const getCorsConfig = (config: ConfigService<Env>): CorsOptions => {
	return {
		credentials: true,
		origin: config.get("WEB_URL"),
	};
};
