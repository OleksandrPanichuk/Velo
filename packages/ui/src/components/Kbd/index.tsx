import * as React from "react";

import { cn } from "../../lib/cn";

interface KbdProps extends React.HTMLAttributes<HTMLElement> {
	keys?: string[];
}

function Kbd({ className, keys, children, ...props }: KbdProps) {
	const items = keys ?? (typeof children === "string" ? [children] : null);

	if (items) {
		return (
			<span className="inline-flex items-center gap-0.5">
				{items.map((key, i) => (
					<kbd
						key={i}
						className={cn(
							"inline-flex h-5 min-w-5 items-center justify-center px-1",
							"border-border bg-surface-muted rounded border",
							"text-text-secondary font-mono text-[10px] font-medium shadow-sm",
							className,
						)}
						{...props}
					>
						{key}
					</kbd>
				))}
			</span>
		);
	}

	return (
		<kbd
			className={cn(
				"inline-flex h-5 min-w-5 items-center justify-center px-1",
				"border-border bg-surface-muted rounded border",
				"text-text-secondary font-mono text-[10px] font-medium shadow-sm",
				className,
			)}
			{...props}
		>
			{children}
		</kbd>
	);
}

export { Kbd, type KbdProps };
