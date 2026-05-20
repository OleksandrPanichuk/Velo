import { days, minutes } from "@repo/primitives";

export enum AuthStrategies {
	JWT_ACCESS = "jwt-access",
	JWT_REFRESH = "jwt-refresh",
	GOOGLE = "google",
	GITHUB = "github",
}

export const PASSWORD_RESET_TTL_MS = minutes(60);
export const ACCESS_TOKEN_TTL_MS = minutes(15);
export const REFRESH_TOKEN_TTL_MS = days(7);
