import z from "zod";

import { FORM_ERRORS } from "@/constants/form-errors";
import { passwordRegex } from "@/constants/regex";

export const ResetPasswordInputSchema = z
	.object({
		password: z
			.string()
			.nonempty({ message: FORM_ERRORS.auth.password.required })
			.min(8, { message: FORM_ERRORS.auth.password.length })
			.refine((val) => passwordRegex.test(val), { message: FORM_ERRORS.auth.password.format }),
		confirmPassword: z.string().nonempty({ message: FORM_ERRORS.auth.confirmPassword.required }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: FORM_ERRORS.auth.confirmPassword.mismatch,
		path: ["confirmPassword"],
	});

export type ResetPasswordInput = z.infer<typeof ResetPasswordInputSchema>;
