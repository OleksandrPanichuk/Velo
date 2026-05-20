import Link from "next/link";

import { Button, ButtonSizes, ButtonVariants } from "@repo/ui";

import { ROUTES } from "@/constants";

import styles from "./OAuthFailureView.module.css";

export function OAuthFailureView() {
	return (
		<div className="flex flex-col items-center gap-8 text-center">
			<div className={`${styles.failureIcon} relative`}>
				<div className="absolute inset-0 rounded-full bg-red-500/8 blur-xl" aria-hidden />
				<svg
					width="64"
					height="64"
					viewBox="0 0 54 54"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden
				>
					<circle
						className={styles.xCirclePath}
						cx="27"
						cy="27"
						r="25"
						stroke="rgb(239 68 68)"
						strokeWidth="2"
						strokeLinecap="round"
					/>
					<path
						className={styles.xPath1}
						d="M18.5 18.5L35.5 35.5"
						stroke="rgb(239 68 68)"
						strokeWidth="2.5"
						strokeLinecap="round"
					/>
					<path
						className={styles.xPath2}
						d="M35.5 18.5L18.5 35.5"
						stroke="rgb(239 68 68)"
						strokeWidth="2.5"
						strokeLinecap="round"
					/>
				</svg>
			</div>

			<div className={`${styles.textBlock} flex flex-col gap-2`}>
				<h2 className="text-text-primary text-2xl font-semibold tracking-tight">Sign-in failed</h2>
				<p className="text-text-secondary text-sm leading-relaxed">
					We couldn&apos;t connect your account.
					<br />
					This can happen if you denied access or the session expired.
				</p>
			</div>

			<div className={`${styles.actionsBlock} flex w-full flex-col gap-2.5`}>
				<Button size={ButtonSizes.Large} asChild fullWidth>
					<Link href={ROUTES.auth.login}>Try again</Link>
				</Button>
				<Button size={ButtonSizes.Large} fullWidth variant={ButtonVariants.Outline} asChild>
					<Link href={ROUTES.auth.login}>Use email instead</Link>
				</Button>
			</div>

			<p className="text-text-tertiary text-xs">
				Need help?{" "}
				<a
					href="mailto:support@velo.app"
					className="text-text-secondary hover:text-text-primary underline underline-offset-4 transition-colors duration-100"
				>
					Contact support
				</a>
			</p>
		</div>
	);
}
