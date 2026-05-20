import { Button, ButtonSizes } from "@repo/ui";

import { VeloMark } from "@/components/icons";
import {
	MOCK_ISSUES,
	STATUS_COLORS,
} from "@/features/onboarding/ui/views/OnboardingView/OnboardingView.constants";
import styles from "@/features/onboarding/ui/views/OnboardingView/OnboardingView.module.css";

interface ReadyStepProps {
	workspaceName: string;
	workspaceSlug: string;
}

const NAV_ITEMS = ["Issues", "Cycles", "Roadmap", "Members"] as const;

export function ReadyStep({ workspaceName, workspaceSlug }: ReadyStepProps) {
	return (
		<div className="flex flex-col items-center gap-8 text-center">
			<div className="relative flex items-center justify-center">
				<div className={`${styles.dot1} absolute size-2 rounded-sm`} aria-hidden />
				<div className={`${styles.dot2} absolute size-2 rounded-sm`} aria-hidden />
				<div className={`${styles.dot3} absolute size-1.5 rounded-full`} aria-hidden />
				<div className={`${styles.dot4} absolute size-1.5 rounded-full`} aria-hidden />
				<div className={`${styles.dot5} absolute size-2.5 rounded-sm`} aria-hidden />
				<div className={`${styles.dot6} absolute size-2 rounded-full`} aria-hidden />

				<div className={styles.completionIcon}>
					<svg
						width="72"
						height="72"
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
							strokeWidth="1.75"
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
			</div>

			<div className="flex flex-col gap-2">
				<h1 className="text-text-primary text-2xl font-semibold tracking-tight">
					Your workspace is ready
				</h1>
				<p className="text-text-secondary text-sm leading-relaxed">
					<span className="text-brand-500 font-medium">{workspaceSlug}.velo.app</span> is live and
					waiting for your team.
				</p>
			</div>

			<div
				className={`${styles.previewCard} border-border bg-surface-elevated w-full overflow-hidden rounded-xl border shadow-lg shadow-black/5`}
			>
				<div className="border-border flex items-center gap-2.5 border-b px-4 py-3">
					<VeloMark className="size-5" />
					<span className="text-text-primary text-sm font-semibold">{workspaceName}</span>
					<div className="bg-brand-500/15 text-brand-500 ml-auto rounded-full px-2 py-0.5 text-xs font-medium">
						Free
					</div>
				</div>

				<div className="flex">
					<div className="border-border hidden w-36 shrink-0 flex-col gap-0.5 border-r p-2.5 sm:flex">
						{NAV_ITEMS.map((item, i) => (
							<div
								key={item}
								className={`rounded-md px-2.5 py-1.5 text-left text-xs ${
									i === 0 ? "bg-brand-500/10 text-brand-500 font-medium" : "text-text-tertiary"
								}`}
							>
								{item}
							</div>
						))}
					</div>

					<div className="flex flex-1 flex-col divide-y divide-neutral-100 dark:divide-neutral-800">
						{MOCK_ISSUES.map(({ status, label }) => (
							<div key={label} className="flex items-center gap-3 px-4 py-2.5">
								<div className={`size-2 shrink-0 rounded-full ${STATUS_COLORS[status]}`} />
								<span
									className={`text-xs ${status === "done" ? "text-text-tertiary line-through" : "text-text-secondary"}`}
								>
									{label}
								</span>
							</div>
						))}
					</div>
				</div>
			</div>

			<Button size={ButtonSizes.Large} fullWidth>
				Open workspace
			</Button>
		</div>
	);
}
