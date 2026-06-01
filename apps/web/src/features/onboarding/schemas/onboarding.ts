import z from "zod";

import { CreateWorkspaceInputSchema } from "@/features/workspace/schemas";

export const OnboardingFormSchema = CreateWorkspaceInputSchema.extend({
	role: z.string().nullable(),
	size: z.string().nullable(),
});

export type OnboardingFormValues = z.infer<typeof OnboardingFormSchema>;
