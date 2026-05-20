import Sentry from "@sentry/nestjs";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import dotenv from "dotenv";

const nodeEnv = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${nodeEnv}` });

const isProduction = nodeEnv === "production";

Sentry.init({
	dsn: process.env.SENTRY_DSN,
	enabled: !!process.env.SENTRY_DSN,
	environment: nodeEnv,
	integrations: [nodeProfilingIntegration()],
	tracesSampleRate: isProduction ? 0.1 : 1.0,
	profileSessionSampleRate: isProduction ? 0.1 : 1.0,
});
