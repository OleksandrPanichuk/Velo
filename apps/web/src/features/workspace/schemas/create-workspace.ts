import z from "zod";

import { FORM_ERRORS } from "@/constants/form-errors";
import { workspaceNameRegex, workspaceSlugRegex } from "@/constants/regex";
import {
	WORKSPACE_NAME_MAX_LENGTH,
	WORKSPACE_NAME_MIN_LENGTH,
	WORKSPACE_SLUG_MAX_LENGTH,
	WORKSPACE_SLUG_MIN_LENGTH,
} from "@/features/workspace/constants";

export const CreateWorkspaceInputSchema = z.object({
	name: z
		.string()
		.nonempty({ message: FORM_ERRORS.workspace.name.required })
		.min(WORKSPACE_NAME_MIN_LENGTH, { message: FORM_ERRORS.workspace.name.min })
		.max(WORKSPACE_NAME_MAX_LENGTH, { message: FORM_ERRORS.workspace.name.max })
		.refine((val) => workspaceNameRegex.test(val), {
			message: FORM_ERRORS.workspace.name.format,
		}),
	slug: z
		.string()
		.nonempty({ message: FORM_ERRORS.workspace.slug.required })
		.min(WORKSPACE_SLUG_MIN_LENGTH, { message: FORM_ERRORS.workspace.slug.min })
		.max(WORKSPACE_SLUG_MAX_LENGTH, { message: FORM_ERRORS.workspace.slug.max })
		.refine((val) => workspaceSlugRegex.test(val), {
			message: FORM_ERRORS.workspace.slug.format,
		}),
});

export type CreateWorkspaceInput = z.infer<typeof CreateWorkspaceInputSchema>;
