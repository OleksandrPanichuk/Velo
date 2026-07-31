"use client";

import { useEffect } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button, ButtonSizes, ButtonVariants } from "@repo/ui";

import { ROUTES } from "@/constants";
import { acceptInvitePath, takePendingInviteToken } from "@/features/invite/utils";

import styles from "./OAuthSuccessView.module.css";

export function OAuthSuccessView() {
	const router = useRouter();

	useEffect(() => {
		const pendingInvite = takePendingInviteToken();

		if (pendingInvite) {
			router.replace(acceptInvitePath(pendingInvite));
			return;
		}

		const timer = setTimeout(() => {
			router.push(ROUTES.onboarding);
		}, 2800);
		return () => clearTimeout(timer);
	}, [router]);

	return (
		<div className="flex flex-col items-center gap-8 text-center">
			<div className="relative flex items-center justify-center">
				<div
					className={`${styles.ring1} absolute size-24 rounded-full border-2 border-violet-400/30`}
					aria-hidden
				/>
				<div
					className={`${styles.ring2} absolute size-24 rounded-full border-2 border-violet-400/20`}
					aria-hidden
				/>

				<svg
					width="64"
					height="64"
					viewBox="0 0 54 54"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden
				>
					<circle
						className={styles.circlePath}
						cx="27"
						cy="27"
						r="25"
						stroke="rgb(139 92 246)"
						strokeWidth="2"
						strokeLinecap="round"
					/>
					<path
						className={styles.checkPath}
						d="M16 27.5L23.5 35L38 20"
						stroke="rgb(139 92 246)"
						strokeWidth="2.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</div>

			<div className={`${styles.textBlock} flex flex-col gap-2`}>
				<h2 className="text-text-primary text-2xl font-semibold tracking-tight">You&apos;re in</h2>
				<p className="text-text-secondary text-sm leading-relaxed">
					Account connected successfully.
					<br />
					Taking you to your workspace&hellip;
				</p>
			</div>

			<div className="w-full">
				<div className="bg-border h-px w-full overflow-hidden rounded-full">
					<div className={`${styles.progressBar} bg-brand-500 h-full rounded-full`} />
				</div>
			</div>

			<div className={`${styles.fallbackButton} w-full`}>
				<Button asChild size={ButtonSizes.Large} fullWidth variant={ButtonVariants.Outline}>
					<Link href={ROUTES.onboarding}>Continue to workspace</Link>
				</Button>
			</div>
		</div>
	);
}
