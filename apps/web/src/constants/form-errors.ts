export const FORM_ERRORS = {
	workspace: {
		name: {
			required: "Workspace name is required",
			min: "Name must be at least 3 characters",
			max: "Name must be at most 64 characters",
			format: "Name can only contain letters, numbers, and spaces",
		},
		slug: {
			required: "Workspace URL is required",
			min: "URL must be at least 3 characters",
			max: "URL must be at most 32 characters",
			format: "URL can only contain lowercase letters, numbers, and hyphens",
		},
	},
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
