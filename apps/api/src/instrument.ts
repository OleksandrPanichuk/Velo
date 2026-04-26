import Sentry from "@sentry/nestjs";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import dotenv from "dotenv";

dotenv.config();

Sentry.init({
	dsn: process.env.SENTRY_DSN,
	integrations: [nodeProfilingIntegration()],
	tracesSampleRate: 1.0,
	profileSessionSampleRate: 1.0,
});
