import { createEnv } from "next-env-safe";
import z from "zod";

export const env = createEnv({
	server: {},
	client: {
		NEXT_PUBLIC_API_URL: z.url(),
		NEXT_PUBLIC_APP_URL: z.url(),
	},
	runtimeEnv: {
		NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
		NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
	},
});
