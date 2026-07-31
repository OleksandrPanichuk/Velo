import z from "zod";

import { FORM_ERRORS } from "@/constants/form-errors";
import { INVITE_EMAIL_MAX_LENGTH } from "@/features/invite/constants";
import type { WorkspaceInviteRole } from "@/graphql/types";

export const INVITE_ROLE_VALUES = [
	"ADMIN",
	"MEMBER",
	"GUEST",
] as const satisfies readonly WorkspaceInviteRole[];

export const InviteMemberFormSchema = z.object({
	email: z
		.string()
		.nonempty({ message: FORM_ERRORS.auth.email.required })
		.email({ error: FORM_ERRORS.auth.email.invalid })
		.max(INVITE_EMAIL_MAX_LENGTH),
	role: z.enum(INVITE_ROLE_VALUES),
});

export type InviteMemberFormValues = z.infer<typeof InviteMemberFormSchema>;
