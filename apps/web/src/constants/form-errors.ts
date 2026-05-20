export const FORM_ERRORS = {
	auth: {
		email: {
			required: "Email is required",
			invalid: "Invalid email address",
		},
		password: {
			required: "Password is required",
			length: "Password must be at least 8 characters long",
			format:
				"Password must contain at least one uppercase letter, one lowercase letter, and one number",
		},
		confirmPassword: {
			required: "Please confirm your password",
			mismatch: "Passwords do not match",
		},
		fullName: {
			required: "Full name is required",
			length: "Full name must be at least 2 characters long",
		},
		username: {
			required: "Username is required",
			length: "Username must be between 3 and 35 characters",
			format: "Username can only contain letters, numbers, underscores, and hyphens",
		},
	},
} as const;
