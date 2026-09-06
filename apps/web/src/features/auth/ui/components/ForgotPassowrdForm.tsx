"use client";

import { useState } from "react";

import Link from "next/link";

import { Button, ButtonSizes, Input } from "@repo/ui";
import { useForm } from "@tanstack/react-form";
import { Mail } from "lucide-react";

import { ROUTES } from "@/constants";
import { ForgotPasswordInputSchema } from "@/features/auth/schemas";
import { useForgotPasswordMutation } from "@/graphql/hooks";

import { ForgotPasswordFormHarness } from "./ForgotPasswordForm.harness";

export function ForgotPasswordForm() {
	const [submitted, setSubmitted] = useState(false);
	const [serverError, setServerError] = useState<string | null>(null);

	const [forgotPassword] = useForgotPasswordMutation();

	const form = useForm({
		defaultValues: { email: "" },
		validators: {
			onBlur: ForgotPasswordInputSchema,
			onSubmit: ForgotPasswordInputSchema,
		},
		onSubmit: async ({ value }) => {
			setServerError(null);
			try {
				await forgotPassword({ variables: { input: value } });
				setSubmitted(true);
			} catch (err) {
				const message =
					err instanceof Error ? err.message : "Something went wrong. Please try again.";
				setServerError(message.replace("ApolloError: ", ""));
			}
		},
	});

	if (submitted) {
		return (
			<div data-qa={ForgotPasswordFormHarness.Submitted} className="flex flex-col gap-6">
				<div className="flex flex-col gap-1">
					<h2 className="text-text-primary text-2xl font-semibold tracking-tight">
						Check your inbox
					</h2>
					<p className="text-text-secondary text-sm">
						We sent a password reset link to{" "}
						<span
							data-qa={ForgotPasswordFormHarness.SubmittedEmail}
							className="text-text-primary font-medium"
						>
							{form.getFieldValue("email")}
						</span>
					</p>
				</div>

				<p className="text-text-tertiary text-sm">
					Didn&apos;t receive it? Check your spam folder or{" "}
					<button
						data-qa={ForgotPasswordFormHarness.TryAnotherEmail}
						type="button"
						onClick={() => setSubmitted(false)}
						className="text-brand-500 hover:text-brand-400 font-medium transition-colors duration-100"
					>
						try another email
					</button>
					.
				</p>

				<Link
					data-qa={ForgotPasswordFormHarness.BackToLogin}
					href={ROUTES.auth.login}
					className="text-text-secondary hover:text-text-primary text-center text-sm transition-colors duration-100"
				>
					Back to sign in
				</Link>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-1">
				<h2 className="text-text-primary text-2xl font-semibold tracking-tight">
					Forgot password?
				</h2>
				<p className="text-text-secondary text-sm">
					Enter your email and we&apos;ll send you a reset link
				</p>
			</div>

			<form
				data-qa={ForgotPasswordFormHarness.Form}
				className="flex flex-col gap-4"
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
			>
				<form.Field name="email">
					{(field) => (
						<Input
							data-qa={ForgotPasswordFormHarness.Email}
							label="Email"
							type="email"
							placeholder="you@example.com"
							autoComplete="email"
							startAdornment={<Mail />}
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
							error={field.state.meta.isTouched ? field.state.meta.errors[0]?.message : undefined}
						/>
					)}
				</form.Field>

				{serverError && (
					<p data-qa={ForgotPasswordFormHarness.ServerError} className="text-sm text-red-500">
						{serverError}
					</p>
				)}

				<Button
					data-qa={ForgotPasswordFormHarness.Submit}
					type="submit"
					size={ButtonSizes.Large}
					fullWidth
					loading={form.state.isSubmitting}
				>
					Send reset link
				</Button>
			</form>

			<Link
				data-qa={ForgotPasswordFormHarness.BackToLogin}
				href={ROUTES.auth.login}
				className="text-text-secondary hover:text-text-primary text-center text-sm transition-colors duration-100"
			>
				Back to sign in
			</Link>
		</div>
	);
}
