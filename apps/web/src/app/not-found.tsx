import Link from "next/link";

import { Compass } from "lucide-react";

import { ROUTES } from "@/constants";

export default function NotFound() {
	return (
		<div className="bg-surface flex min-h-svh flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
			<span className="bg-brand-muted text-brand-600 dark:text-brand-300 flex size-12 items-center justify-center rounded-xl">
				<Compass className="size-6" />
			</span>

			<div className="flex flex-col gap-2">
				<h1 className="text-text-primary text-xl font-semibold tracking-tight">Page not found</h1>
				<p className="text-text-secondary max-w-sm text-sm">
					This page does not exist, or you no longer have access to it. If you were looking for a
					workspace, ask an admin for an invite or switch to one of your own.
				</p>
			</div>

			<Link
				href={ROUTES.root}
				className="bg-brand-500 hover:bg-brand-600 rounded-md px-4 py-2 text-sm font-medium text-white transition-colors duration-100"
			>
				Go to my workspaces
			</Link>
		</div>
	);
}
