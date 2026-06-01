import { Button, ButtonSizes, Spinner } from "@repo/ui";

import { AnimatedCheckIcon, VeloMark } from "@/components/icons";
import {
	MOCK_ISSUES,
	STATUS_COLORS,
} from "@/features/onboarding/ui/views/OnboardingView/OnboardingView.constants";
import styles from "@/features/onboarding/ui/views/OnboardingView/OnboardingView.module.css";

interface ReadyStepProps {
	workspaceName: string;
	workspaceSlug: string;
	loading: boolean;
	error?: string;
	onComplete: () => void;
	onBack: () => void;
}

const NAV_ITEMS = ["Issues", "Cycles", "Roadmap", "Members"] as const;

export function ReadyStep({
	workspaceName,
	workspaceSlug,
	loading,
	error,
	onComplete,
	onBack,
}: ReadyStepProps) {
	return (
		<div className="flex flex-col items-center gap-8 text-center">
			<div className="relative flex items-center justify-center">
				<div className={`${styles.dot1} absolute size-2 rounded-sm`} aria-hidden />
				<div className={`${styles.dot2} absolute size-2 rounded-sm`} aria-hidden />
				<div className={`${styles.dot3} absolute size-1.5 rounded-full`} aria-hidden />
				<div className={`${styles.dot4} absolute size-1.5 rounded-full`} aria-hidden />
				<div className={`${styles.dot5} absolute size-2.5 rounded-sm`} aria-hidden />
				<div className={`${styles.dot6} absolute size-2 rounded-full`} aria-hidden />

				<AnimatedCheckIcon className={styles.completionIcon} />
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

			{error && (
				<div className="flex flex-col items-center gap-1.5">
					<p className="text-sm text-red-500">{error}</p>
					<button
						type="button"
						onClick={onBack}
						className="text-brand-500 hover:text-brand-600 text-xs underline-offset-2 hover:underline"
					>
						Change workspace name
					</button>
				</div>
			)}

			<Button size={ButtonSizes.Large} fullWidth onClick={onComplete} disabled={loading}>
				{loading ? <Spinner /> : "Open workspace"}
			</Button>
		</div>
	);
}
