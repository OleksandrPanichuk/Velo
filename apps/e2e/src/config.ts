export const E2E_WEB_PORT = 3001;
export const E2E_API_PORT = 8081;

export const WEB_URL = process.env.BASE_URL ?? `http://localhost:${E2E_WEB_PORT}`;
export const API_URL = process.env.E2E_API_URL ?? `http://localhost:${E2E_API_PORT}`;
export const MAILPIT_URL = process.env.E2E_MAILPIT_URL ?? "http://localhost:8026";

export const GRAPHQL_URL = `${API_URL}/graphql`;

export const apiEnv: Record<string, string> = {
	NODE_ENV: "test",
	PORT: String(E2E_API_PORT),
	DB_HOST: "localhost",
	DB_PORT: "5434",
	DB_NAME: "velo_e2e",
	DB_USERNAME: "postgres",
	DB_PASSWORD: "postgres",
	REDIS_HOST: "localhost",
	REDIS_PORT: "6381",
	CACHE_KEY_PREFIX: "velo_cache_e2e",
	THROTTLE_LIMIT: "100000",
	AWS_S3_ENDPOINT: "http://localhost:9020",
	AWS_S3_BUCKET_NAME: "velo-e2e",
	SMTP_HOST: "localhost",
	SMTP_PORT: "1026",
	SMTP_SECURE: "false",
	SMTP_USER: "e2e",
	SMTP_PASS: "e2e",
	WEB_URL,
	BASE_URL: API_URL,
	CLIENT_EMAIL_VERIFICATION_URL: `${WEB_URL}/verify-email`,
	CLIENT_RESET_PASSWORD_URL: `${WEB_URL}/reset-password`,
	CLIENT_INVITE_URL: `${WEB_URL}/invite`,
	OAUTH_SUCCESS_REDIRECT: `${WEB_URL}/oauth/success`,
	OAUTH_FAILURE_REDIRECT: `${WEB_URL}/oauth/failure`,
	GOOGLE_CALLBACK_URL: `${API_URL}/api/auth/google/callback`,
	GITHUB_CALLBACK_URL: `${API_URL}/api/auth/github/callback`,
};

export const webEnv: Record<string, string> = {
	NEXT_PUBLIC_API_URL: API_URL,
	NEXT_PUBLIC_APP_URL: WEB_URL,
	API_URL,
	PORT: String(E2E_WEB_PORT),
};
