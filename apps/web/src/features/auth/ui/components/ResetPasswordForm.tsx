"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button, ButtonSizes, Input } from "@repo/ui";
import { useForm } from "@tanstack/react-form";
import { Eye, EyeOff } from "lucide-react";

import { ROUTES } from "@/constants";
import { ResetPasswordInputSchema } from "@/features/auth/schemas";
import { useResetPasswordMutation } from "@/graphql/hooks";

interface Props {
	token: string | undefined;
}

export function ResetPasswordForm({ token }: Props) {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const [serverError, setServerError] = useState<string | null>(null);
	const [done, setDone] = useState(false);
	const router = useRouter();

	const [resetPassword] = useResetPasswordMutation();

	const form = useForm({
		defaultValues: { password: "", confirmPassword: "" },
		validators: {
			onBlur: ResetPasswordInputSchema,
			onSubmit: ResetPasswordInputSchema,
		},
		onSubmit: async ({ value }) => {
			if (!token) return;
			setServerError(null);
			try {
				await resetPassword({ variables: { input: { token, password: value.password } } });
				setDone(true);
			} catch (err) {
				const message =
					err instanceof Error ? err.message : "Something went wrong. Please try again.";
				setServerError(message.replace("ApolloError: ", ""));
			}
		},
	});

	if (!token) {
		return (
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-1">
					<h2 className="text-text-primary text-2xl font-semibold tracking-tight">Invalid link</h2>
					<p className="text-text-secondary text-sm">
						This password reset link is missing a token.
					</p>
				</div>
				<Link
					href={ROUTES.auth.forgotPassword}
					className="text-text-secondary hover:text-text-primary text-center text-sm transition-colors duration-100"
				>
					Request a new link
				</Link>
			</div>
		);
	}

	if (done) {
		return (
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-1">
					<h2 className="text-text-primary text-2xl font-semibold tracking-tight">
						Password updated
					</h2>
					<p className="text-text-secondary text-sm">
						Your password has been reset. You can now sign in with your new password.
					</p>
				</div>
				<Button size={ButtonSizes.Large} fullWidth onClick={() => router.push(ROUTES.auth.login)}>
					Continue to sign in
				</Button>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-1">
				<h2 className="text-text-primary text-2xl font-semibold tracking-tight">
					Set new password
				</h2>
				<p className="text-text-secondary text-sm">
					Must be at least 8 characters with uppercase, lowercase, and a number
				</p>
			</div>

			<form
				className="flex flex-col gap-4"
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
			>
				<form.Field name="password">
					{(field) => (
						<Input
							label="New password"
							type={showPassword ? "text" : "password"}
							placeholder="••••••••"
							autoComplete="new-password"
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
							error={field.state.meta.isTouched ? field.state.meta.errors[0]?.message : undefined}
							endAdornment={
								<button
									type="button"
									onClick={() => setShowPassword((v) => !v)}
									className="text-text-tertiary hover:text-text-secondary transition-colors"
									aria-label={showPassword ? "Hide password" : "Show password"}
								>
									{showPassword ? <EyeOff /> : <Eye />}
								</button>
							}
						/>
					)}
				</form.Field>

				<form.Field name="confirmPassword">
					{(field) => (
						<Input
							label="Confirm new password"
							type={showConfirm ? "text" : "password"}
							placeholder="••••••••"
							autoComplete="new-password"
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
							error={field.state.meta.isTouched ? field.state.meta.errors[0]?.message : undefined}
							endAdornment={
								<button
									type="button"
									onClick={() => setShowConfirm((v) => !v)}
									className="text-text-tertiary hover:text-text-secondary transition-colors"
									aria-label={showConfirm ? "Hide password" : "Show password"}
								>
									{showConfirm ? <EyeOff /> : <Eye />}
								</button>
							}
						/>
					)}
				</form.Field>

				{serverError && <p className="text-sm text-red-500">{serverError}</p>}

				<Button
					type="submit"
					size={ButtonSizes.Large}
					fullWidth
					loading={form.state.isSubmitting}
					className="mt-1"
				>
					Reset password
				</Button>
			</form>

			<Link
				href={ROUTES.auth.login}
				className="text-text-secondary hover:text-text-primary text-center text-sm transition-colors duration-100"
			>
				Back to sign in
			</Link>
		</div>
	);
}
