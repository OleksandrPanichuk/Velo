import { cn } from "@repo/ui";

import styles from "@/features/onboarding/ui/views/OnboardingView/OnboardingView.module.css";

export function AnimatedCheckIcon({ className }: { className?: string }) {
	return (
		<svg
			width="72"
			height="72"
			viewBox="0 0 54 54"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden
			className={cn(className)}
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
	);
}
