import { cn } from "@repo/ui";

export function WorkspaceIcon({ className }: { className?: string }) {
	return (
		<svg
			width="32"
			height="32"
			viewBox="0 0 32 32"
			fill="none"
			aria-hidden
			className={cn(className)}
		>
			<rect x="4" y="12" width="24" height="16" rx="2" stroke="rgb(139 92 246)" strokeWidth="1.5" />
			<path
				d="M10 12V9a6 6 0 0 1 12 0v3"
				stroke="rgb(139 92 246)"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<circle cx="16" cy="20" r="2" fill="rgb(139 92 246)" />
		</svg>
	);
}
