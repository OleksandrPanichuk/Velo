"use client";

import { AlertTriangle } from "lucide-react";

import { Button, ButtonSizes, ButtonVariants } from "@repo/ui";

interface ErrorPageProps {
	reset: () => void;
}

export default function ErrorPage({ reset }: ErrorPageProps) {
	return (
		<div className="bg-surface flex min-h-svh flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
			<span className="flex size-12 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
				<AlertTriangle className="size-6" />
			</span>

			<div className="flex flex-col gap-2">
				<h1 className="text-text-primary text-xl font-semibold tracking-tight">
					Something went wrong
				</h1>
				<p className="text-text-secondary max-w-sm text-sm">
					We could not load this page. This is usually temporary — try again in a moment.
				</p>
			</div>

			<Button variant={ButtonVariants.Outline} size={ButtonSizes.Large} onClick={reset}>
				Try again
			</Button>
		</div>
	);
}
