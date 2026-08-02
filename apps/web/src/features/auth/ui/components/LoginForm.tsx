"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button, ButtonSizes, Input, PasswordInput } from "@repo/ui";
import { useForm } from "@tanstack/react-form";
import { Mail } from "lucide-react";

import { OAuthProvider, ROUTES } from "@/constants";
import { LoginInputSchema } from "@/features/auth/schemas";
import { acceptInvitePath, withInviteToken } from "@/features/invite/utils";
import { useSignInMutation } from "@/graphql/hooks";

import { LoginFormHarness } from "./LoginForm.harness";
import { OAuthButton } from "./OAuthButton";

interface Props {
	inviteToken?: string;
}

export function LoginForm({ inviteToken }: Props) {
	const [serverError, setServerError] = useState<string | null>(null);
	const router = useRouter();

	const [signIn, { loading }] = useSignInMutation();

	const form = useForm({
		defaultValues: { email: "", password: "" },
		validators: {
			onBlur: LoginInputSchema,
			onSubmit: LoginInputSchema,
		},
		onSubmit: async ({ value }) => {
			setServerError(null);
			try {
				await signIn({ variables: { input: value } });
				router.push(inviteToken ? acceptInvitePath(inviteToken) : ROUTES.root);
			} catch (err) {
				const message =
					err instanceof Error ? err.message : "Something went wrong. Please try again.";
				setServerError(message.replace("ApolloError: ", ""));
			}
		},
	});

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-1">
				<h2 className="text-text-primary text-2xl font-semibold tracking-tight">Welcome back</h2>
				<p className="text-text-secondary text-sm">Sign in to your Velo workspace</p>
			</div>

			<div className="flex flex-col gap-2.5">
				<OAuthButton
					provider={OAuthProvider.Google}
					inviteToken={inviteToken}
					data-qa={LoginFormHarness.GoogleButton}
				>
					Continue with Google
				</OAuthButton>
				<OAuthButton
					provider={OAuthProvider.Github}
					inviteToken={inviteToken}
					data-qa={LoginFormHarness.GithubButton}
				>
					Continue with GitHub
				</OAuthButton>
			</div>

			<div className="flex items-center gap-3">
				<span className="border-border flex-1 border-t" />
				<span className="text-text-tertiary text-xs">or</span>
				<span className="border-border flex-1 border-t" />
			</div>

			<form
				data-qa={LoginFormHarness.Form}
				className="flex flex-col gap-4"
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
			>
				<form.Field name="email">
					{(field) => (
						<Input
							data-qa={LoginFormHarness.Email}
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

				<form.Field name="password">
					{(field) => (
						<PasswordInput
							data-qa={LoginFormHarness.Password}
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
							error={field.state.meta.isTouched ? field.state.meta.errors[0]?.message : undefined}
						/>
					)}
				</form.Field>

				<div className="flex justify-end">
					<Link
						data-qa={LoginFormHarness.ForgotPasswordLink}
						href={ROUTES.auth.forgotPassword}
						className="text-text-secondary hover:text-text-primary text-xs transition-colors duration-100"
					>
						Forgot password?
					</Link>
				</div>

				{serverError && (
					<p data-qa={LoginFormHarness.ServerError} className="text-sm text-red-500">
						{serverError}
					</p>
				)}

				<Button
					data-qa={LoginFormHarness.Submit}
					type="submit"
					size={ButtonSizes.Large}
					fullWidth
					loading={loading}
				>
					Sign in
				</Button>
			</form>

			<p className="text-text-tertiary text-center text-sm">
				Don&apos;t have an account?{" "}
				<Link
					data-qa={LoginFormHarness.RegisterLink}
					href={withInviteToken(ROUTES.auth.register, inviteToken)}
					className="text-brand-500 hover:text-brand-400 font-medium transition-colors duration-100"
				>
					Sign up
				</Link>
			</p>
		</div>
	);
}
