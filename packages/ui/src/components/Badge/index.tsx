import * as React from "react";

import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "../../lib/cn";
import { BadgeSizes, BadgeVariants } from "./Badge.constants";

const badgeVariants = cva(
	"inline-flex items-center gap-1 font-medium select-none transition-colors",
	{
		variants: {
			variant: {
				[BadgeVariants.Default]:
					"bg-brand-subtle text-brand-700 dark:bg-brand-950 dark:text-brand-300",
				[BadgeVariants.Secondary]: "bg-surface-muted text-text-secondary",
				[BadgeVariants.Outline]: "border border-border bg-transparent text-text-secondary",
				[BadgeVariants.Success]:
					"bg-green-50 text-green-700 dark:bg-green-950/60 dark:text-green-400",
				[BadgeVariants.Warning]:
					"bg-yellow-50 text-yellow-700 dark:bg-yellow-950/60 dark:text-yellow-400",
				[BadgeVariants.Destructive]: "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-400",
				[BadgeVariants.Urgent]: "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400",
				[BadgeVariants.High]:
					"bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400",
				[BadgeVariants.Medium]:
					"bg-yellow-50 text-yellow-600 dark:bg-yellow-950/40 dark:text-yellow-400",
				[BadgeVariants.Low]: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
			},
			size: {
				[BadgeSizes.Small]: "h-4 px-1.5 text-[10px] rounded",
				[BadgeSizes.Medium]: "h-5 px-2 text-xs rounded-md",
			},
		},
		defaultVariants: { variant: BadgeVariants.Default, size: BadgeSizes.Medium },
	},
);

const dotColorMap: Record<BadgeVariants, string> = {
	[BadgeVariants.Default]: "bg-brand-500",
	[BadgeVariants.Secondary]: "bg-text-tertiary",
	[BadgeVariants.Outline]: "bg-text-tertiary",
	[BadgeVariants.Success]: "bg-green-500",
	[BadgeVariants.Warning]: "bg-yellow-500",
	[BadgeVariants.Destructive]: "bg-red-500",
	[BadgeVariants.Urgent]: "bg-red-500",
	[BadgeVariants.High]: "bg-orange-500",
	[BadgeVariants.Medium]: "bg-yellow-500",
	[BadgeVariants.Low]: "bg-blue-500",
};

interface BadgeProps
	extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
	dot?: boolean;
}

function Badge({
	className,
	variant = BadgeVariants.Default,
	size,
	dot = false,
	children,
	...props
}: BadgeProps) {
	return (
		<span className={cn(badgeVariants({ variant, size }), className)} {...props}>
			{dot && (
				<span
					className={cn(
						"inline-block size-1.5 shrink-0 rounded-full",
						dotColorMap[variant ?? BadgeVariants.Default],
					)}
				/>
			)}
			{children}
		</span>
	);
}

export { Badge, badgeVariants, type BadgeProps };
export { BadgeVariants, BadgeSizes } from "./Badge.constants";
