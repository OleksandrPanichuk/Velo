import * as React from "react";

import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "../../lib/cn";
import { ProgressColors, ProgressSizes } from "./Progress.constants";

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
	value?: number;
	max?: number;
	color?: ProgressColors;
	size?: ProgressSizes;
	showLabel?: boolean;
}

function Progress({
	className,
	value = 0,
	max = 100,
	color = ProgressColors.Brand,
	size = ProgressSizes.Small,
	showLabel = false,
	...props
}: ProgressProps) {
	const pct = Math.min(100, Math.max(0, (value / max) * 100));

	return (
		<div className="flex w-full items-center gap-2">
			<ProgressPrimitive.Root
				className={cn(
					"bg-surface-muted relative w-full overflow-hidden rounded-full",
					size === ProgressSizes.XSmall && "h-1",
					size === ProgressSizes.Small && "h-1.5",
					size === ProgressSizes.Medium && "h-2",
					className,
				)}
				value={value}
				max={max}
				{...props}
			>
				<ProgressPrimitive.Indicator
					className={cn(
						"h-full rounded-full transition-all duration-300 ease-in-out",
						color === ProgressColors.Brand && "bg-brand-default",
						color === ProgressColors.Green && "bg-green-500",
						color === ProgressColors.Yellow && "bg-yellow-500",
						color === ProgressColors.Red && "bg-red-500",
					)}
					style={{ width: `${pct}%` }}
				/>
			</ProgressPrimitive.Root>
			{showLabel && (
				<span className="text-text-tertiary shrink-0 text-xs tabular-nums">{Math.round(pct)}%</span>
			)}
		</div>
	);
}

export { Progress, type ProgressProps };
export { ProgressColors, ProgressSizes } from "./Progress.constants";
