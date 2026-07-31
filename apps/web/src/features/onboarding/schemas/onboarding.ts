import z from "zod";

import { CreateWorkspaceInputSchema } from "@/features/workspace/schemas";
import type { MemberJobRole, WorkspaceSize } from "@/graphql/types";

/**
 * These are the GraphQL enum *names*, which is what travels over the wire — the
 * API maps them to its own lowercase column values. The `satisfies` clauses make
 * a schema change that renames or drops a member fail this build rather than
 * fail at runtime as a rejected mutation.
 */
export const JOB_ROLE_VALUES = [
	"DEVELOPER",
	"DESIGNER",
	"PM",
	"OTHER",
] as const satisfies readonly MemberJobRole[];

export const WORKSPACE_SIZE_VALUES = [
	"SMALL",
	"MEDIUM",
	"LARGE",
	"ENTERPRISE",
] as const satisfies readonly WorkspaceSize[];

export const OnboardingFormSchema = CreateWorkspaceInputSchema.extend({
	role: z.enum(JOB_ROLE_VALUES).nullable(),
	size: z.enum(WORKSPACE_SIZE_VALUES).nullable(),
});

export type OnboardingFormValues = z.infer<typeof OnboardingFormSchema>;
