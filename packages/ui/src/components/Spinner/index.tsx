import * as React from "react";

import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "../../lib/cn";
import { SpinnerSizes } from "./Spinner.constants";

const spinnerVariants = cva(
	"animate-spin rounded-full border-2 border-current border-t-transparent",
	{
		variants: {
			size: {
				[SpinnerSizes.XSmall]: "size-3",
				[SpinnerSizes.Small]: "size-4",
				[SpinnerSizes.Medium]: "size-5",
				[SpinnerSizes.Large]: "size-6",
				[SpinnerSizes.XLarge]: "size-8",
			},
		},
		defaultVariants: { size: SpinnerSizes.Medium },
	},
);

interface SpinnerProps
	extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof spinnerVariants> {}

function Spinner({ className, size, ...props }: SpinnerProps) {
	return (
		<span
			role="status"
			aria-label="Loading"
			className={cn(spinnerVariants({ size }), className)}
			{...props}
		/>
	);
}

export { Spinner, spinnerVariants, type SpinnerProps };
export { SpinnerSizes } from "./Spinner.constants";
