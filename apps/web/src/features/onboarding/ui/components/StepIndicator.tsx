import { Check } from "lucide-react";

import type { Step } from "@/features/onboarding/ui/views/OnboardingView";
import styles from "@/features/onboarding/ui/views/OnboardingView/OnboardingView.module.css";

interface StepIndicatorProps {
	current: Step;
}

const STEPS = [1, 2, 3] as const;

export function StepIndicator({ current }: StepIndicatorProps) {
	return (
		<div className="flex items-center">
			{STEPS.map((s, i) => (
				<div key={s} className="flex items-center">
					<div
						className={`flex size-8 items-center justify-center rounded-full text-xs font-medium transition-all duration-300 ${
							current === s
								? "bg-brand-500 text-white shadow-lg shadow-violet-500/30"
								: current > s
									? "bg-brand-500/15 text-brand-500"
									: "bg-surface-muted text-text-tertiary"
						}`}
					>
						{current > s ? <Check className="size-3.5" strokeWidth={2.5} /> : s}
					</div>

					{i < STEPS.length - 1 && (
						<div className="bg-border relative mx-1.5 h-px w-12 overflow-hidden rounded-full">
							{current > s && (
								<div
									className={`${styles.stepLineActive} bg-brand-500 absolute inset-y-0 left-0 rounded-full`}
								/>
							)}
						</div>
					)}
				</div>
			))}
		</div>
	);
}
