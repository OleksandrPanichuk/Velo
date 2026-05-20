import * as React from "react";

import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "../../lib/cn";

type SeparatorProps = React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>;

function Separator({
	className,
	orientation = "horizontal",
	decorative = true,
	...props
}: SeparatorProps) {
	return (
		<SeparatorPrimitive.Root
			decorative={decorative}
			orientation={orientation}
			className={cn(
				"bg-border shrink-0",
				orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
				className,
			)}
			{...props}
		/>
	);
}

export { Separator, type SeparatorProps };
