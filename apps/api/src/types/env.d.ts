import type { Env } from "@/config";

declare global {
	namespace NodeJS {
		// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- merges Env into NodeJS.ProcessEnv
		interface ProcessEnv extends Env {}
	}
}

export {};
