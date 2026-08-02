"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { Button, ButtonSizes, ButtonVariants } from "@repo/ui";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

import { ROUTES } from "@/constants";
import { useVerifyEmailMutation } from "@/graphql/hooks";

import { VerifyEmailViewHarness } from "./VerifyEmailView.harness";

type Status = "verifying" | "success" | "error";

interface Props {
	token: string | undefined;
}

export function VerifyEmailView({ token }: Props) {
	const [status, setStatus] = useState<Status>(token ? "verifying" : "error");
	const [verifyEmail] = useVerifyEmailMutation();

	useEffect(() => {
		if (!token) return;

		const verify = async () => {
			try {
				await verifyEmail({ variables: { token } });
				setStatus("success");
			} catch {
				setStatus("error");
			}
		};

		verify();
	}, [token, verifyEmail]);

	if (status === "verifying") {
		return (
			<div
				data-qa={VerifyEmailViewHarness.Verifying}
				className="flex flex-col items-center gap-4 text-center"
			>
				<Loader2 className="text-brand-500 size-10 animate-spin" />
				<div className="flex flex-col gap-1">
					<h2 className="text-text-primary text-2xl font-semibold tracking-tight">
						Verifying your email
					</h2>
					<p className="text-text-secondary text-sm">This will only take a moment…</p>
				</div>
			</div>
		);
	}

	if (status === "success") {
		return (
			<div
				data-qa={VerifyEmailViewHarness.Success}
				className="flex flex-col items-center gap-6 text-center"
			>
				<CheckCircle2 className="text-brand-500 size-10" />
				<div className="flex flex-col gap-1">
					<h2 className="text-text-primary text-2xl font-semibold tracking-tight">
						Email verified
					</h2>
					<p className="text-text-secondary text-sm">
						Your email address has been confirmed. You&apos;re all set.
					</p>
				</div>
				<Button size={ButtonSizes.Large} asChild fullWidth>
					<Link data-qa={VerifyEmailViewHarness.ContinueToLogin} href={ROUTES.auth.login}>
						Continue to sign in
					</Link>
				</Button>
			</div>
		);
	}

	return (
		<div
			data-qa={VerifyEmailViewHarness.Error}
			className="flex flex-col items-center gap-6 text-center"
		>
			<XCircle className="size-10 text-red-500" />
			<div className="flex flex-col gap-1">
				<h2
					data-qa={VerifyEmailViewHarness.Title}
					className="text-text-primary text-2xl font-semibold tracking-tight"
				>
					{token ? "Verification failed" : "Invalid link"}
				</h2>
				<p className="text-text-secondary text-sm">
					{token
						? "This link may have expired or already been used."
						: "This verification link is missing a token."}
				</p>
			</div>
			<div className="flex w-full flex-col gap-2.5">
				<Button variant={ButtonVariants.Outline} size={ButtonSizes.Large} asChild fullWidth>
					<Link data-qa={VerifyEmailViewHarness.BackToLogin} href={ROUTES.auth.login}>
						Back to sign in
					</Link>
				</Button>
			</div>
		</div>
	);
}
