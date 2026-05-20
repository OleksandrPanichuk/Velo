import z from "zod";

import { FORM_ERRORS } from "@/constants/form-errors";
import { passwordRegex } from "@/constants/regex";

export const LoginInputSchema = z.object({
	email: z
		.string()
		.nonempty({ message: FORM_ERRORS.auth.email.required })
		.email({ error: FORM_ERRORS.auth.email.invalid }),
	password: z
		.string()
		.nonempty({ message: FORM_ERRORS.auth.password.required })
		.min(8, { message: FORM_ERRORS.auth.password.length })
		.refine((val) => passwordRegex.test(val), { message: FORM_ERRORS.auth.password.format }),
});

export type LoginInput = z.infer<typeof LoginInputSchema>;
