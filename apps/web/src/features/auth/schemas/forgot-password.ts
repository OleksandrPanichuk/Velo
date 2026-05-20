import z from "zod";

import { FORM_ERRORS } from "@/constants/form-errors";

export const ForgotPasswordInputSchema = z.object({
	email: z
		.email({ error: FORM_ERRORS.auth.email.invalid })
		.nonempty({ message: FORM_ERRORS.auth.email.required }),
});

export type ForgotPasswordInput = z.infer<typeof ForgotPasswordInputSchema>;
