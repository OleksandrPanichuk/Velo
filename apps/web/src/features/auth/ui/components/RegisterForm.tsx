"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button, ButtonSizes, Input, PasswordInput } from "@repo/ui";
import { useForm } from "@tanstack/react-form";
import { Mail, User } from "lucide-react";

import { OAuthProvider, ROUTES } from "@/constants";
import { type RegisterInput, RegisterInputSchema } from "@/features/auth/schemas";
import { useSignUpMutation } from "@/graphql/hooks";

import { OAuthButton } from "./OAuthButton";

export function RegisterForm() {
	const [serverError, setServerError] = useState<string | null>(null);
	const router = useRouter();

	const [signUp, { loading }] = useSignUpMutation();

	const form = useForm({
		defaultValues: {
			email: "",
			username: "",
			fullName: "",
			password: "",
			confirmPassword: "",
		} as RegisterInput,
		validators: {
			onBlur: RegisterInputSchema,
			onSubmit: RegisterInputSchema,
		},
		onSubmit: async ({ value }) => {
			setServerError(null);
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { confirmPassword, ...input } = value;
			try {
				await signUp({ variables: { input } });
				router.push(ROUTES.root);
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
				<h2 className="text-text-primary text-2xl font-semibold tracking-tight">
					Create an account
				</h2>
				<p className="text-text-secondary text-sm">
					Start managing projects at the speed of thought
				</p>
			</div>

			<div className="flex flex-col gap-2.5">
				<OAuthButton provider={OAuthProvider.Google}>Continue with Google</OAuthButton>
				<OAuthButton provider={OAuthProvider.Github}>Continue with GitHub</OAuthButton>
			</div>

			<div className="flex items-center gap-3">
				<span className="border-border flex-1 border-t" />
				<span className="text-text-tertiary text-xs">or</span>
				<span className="border-border flex-1 border-t" />
			</div>

			<form
				className="flex flex-col gap-4"
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
			>
				<form.Field name="fullName">
					{(field) => (
						<Input
							label="Full name"
							type="text"
							placeholder="Alex Johnson"
							autoComplete="name"
							startAdornment={<User />}
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
							error={field.state.meta.isTouched ? field.state.meta.errors[0]?.message : undefined}
						/>
					)}
				</form.Field>

				<form.Field name="username">
					{(field) => (
						<Input
							label="Username"
							type="text"
							placeholder="alexjohnson"
							autoComplete="username"
							startAdornment={<span className="text-text-tertiary text-sm">@</span>}
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
							error={field.state.meta.isTouched ? field.state.meta.errors[0]?.message : undefined}
						/>
					)}
				</form.Field>

				<form.Field name="email">
					{(field) => (
						<Input
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
							autoComplete="new-password"
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
							error={field.state.meta.isTouched ? field.state.meta.errors[0]?.message : undefined}
						/>
					)}
				</form.Field>

				<form.Field name="confirmPassword">
					{(field) => (
						<PasswordInput
							label="Confirm password"
							autoComplete="new-password"
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
							error={field.state.meta.isTouched ? field.state.meta.errors[0]?.message : undefined}
						/>
					)}
				</form.Field>

				{serverError && <p className="text-sm text-red-500">{serverError}</p>}

				<Button type="submit" size={ButtonSizes.Large} fullWidth loading={loading} className="mt-1">
					Create account
				</Button>
			</form>

			<p className="text-text-tertiary text-center text-sm">
				Already have an account?{" "}
				<Link
					href={ROUTES.auth.login}
					className="text-brand-500 hover:text-brand-400 font-medium transition-colors duration-100"
				>
					Sign in
				</Link>
			</p>
		</div>
	);
}
