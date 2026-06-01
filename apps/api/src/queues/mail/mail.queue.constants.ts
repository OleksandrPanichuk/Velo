import { type JobsOptions } from "bullmq";

export const MAIL_JOB_OPTIONS: JobsOptions = {
	attempts: 5,
	backoff: {
		type: "exponential",
		delay: 2000,
	},
	removeOnComplete: true,
	removeOnFail: 1000,
} as const;
