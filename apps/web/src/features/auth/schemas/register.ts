import z from "zod";

import { FORM_ERRORS } from "@/constants/form-errors";
import { passwordRegex, usernameRegex } from "@/constants/regex";

export const RegisterInputSchema = z
	.object({
		email: z
			.string()
			.nonempty({ message: FORM_ERRORS.auth.email.required })
			.email({ error: FORM_ERRORS.auth.email.invalid }),
		username: z
			.string()
			.nonempty({ message: FORM_ERRORS.auth.username.required })
			.min(3, { message: FORM_ERRORS.auth.username.length })
			.max(35, { message: FORM_ERRORS.auth.username.length })
			.regex(usernameRegex, { message: FORM_ERRORS.auth.username.format }),
		fullName: z
			.string()
			.nonempty({ message: FORM_ERRORS.auth.fullName.required })
			.min(2, { message: FORM_ERRORS.auth.fullName.length }),
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

export type RegisterInput = z.infer<typeof RegisterInputSchema>;
