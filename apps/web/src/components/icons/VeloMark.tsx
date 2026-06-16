import { cn } from "@repo/ui";

import type { IBaseIconProps } from "@/types/icons.typedefs";

export function VeloMark({ className, ...props }: IBaseIconProps) {
	return (
		<svg
			viewBox="0 0 32 32"
			fill="none"
			aria-hidden="true"
			className={cn("size-8 shrink-0", className)}
			{...props}
		>
			<rect width="32" height="32" rx="8" fill="#8b5cf6" />
			<path d="M7 9h4.5l4.5 9.5L20.5 9H25L16 23.5z" fill="white" />
		</svg>
	);
}
