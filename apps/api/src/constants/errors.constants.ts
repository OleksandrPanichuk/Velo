export const ErrorMessages = {
	AUTH: {
		EMAIL_IN_USE: "Email already in use",
		INVALID_CREDENTIALS: "Invalid credentials",
		UNAUTHORIZED: "Unauthorized",
		PASSWORD_NOT_SET: "This account uses social login — please sign in with Google or GitHub",
		OAUTH_ACCOUNT_EXISTS: "This social account is already linked to another user",
		INVALID_VERIFICATION_TOKEN: "Invalid or expired verification token",
		EMAIL_ALREADY_VERIFIED: "Email is already verified",
		INVALID_RESET_TOKEN: "Invalid or expired password reset token",
	},
} as const;
