import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";
import { AvatarSizes } from "./Avatar.constants";

const avatarVariants = cva("relative inline-flex shrink-0 overflow-hidden rounded-full", {
	variants: {
		size: {
			[AvatarSizes.XSmall]: "size-5  text-[9px]",
			[AvatarSizes.Small]: "size-6  text-[10px]",
			[AvatarSizes.Medium]: "size-7  text-xs",
			[AvatarSizes.Large]: "size-8  text-sm",
			[AvatarSizes.XLarge]: "size-10 text-sm",
			[AvatarSizes.XXLarge]: "size-12 text-base",
		},
	},
	defaultVariants: { size: AvatarSizes.Medium },
});

interface AvatarProps
	extends
		React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
		VariantProps<typeof avatarVariants> {
	src?: string;
	alt?: string;
	fallback?: string;
}

function Avatar({ className, size, src, alt, fallback, ...props }: AvatarProps) {
	return (
		<AvatarPrimitive.Root className={cn(avatarVariants({ size }), className)} {...props}>
			<AvatarPrimitive.Image
				src={src}
				alt={alt ?? fallback}
				className="aspect-square size-full object-cover"
			/>
			<AvatarPrimitive.Fallback
				className="flex size-full items-center justify-center rounded-full bg-brand-muted font-medium text-brand-700 dark:text-brand-300"
				delayMs={300}
			>
				{fallback?.slice(0, 2).toUpperCase()}
			</AvatarPrimitive.Fallback>
		</AvatarPrimitive.Root>
	);
}

function AvatarGroup({
	children,
	max = 4,
	className,
}: {
	children: React.ReactNode;
	max?: number;
	className?: string;
}) {
	const items = React.Children.toArray(children);
	const visible = items.slice(0, max);
	const overflow = items.length - max;

	return (
		<div className={cn("flex items-center -space-x-2", className)}>
			{visible.map((child, i) => (
				<div key={i} className="ring-2 ring-surface rounded-full">
					{child}
				</div>
			))}
			{overflow > 0 && (
				<div className="ring-2 ring-surface rounded-full">
					<div className="flex size-7 items-center justify-center rounded-full bg-surface-muted text-xs font-medium text-text-secondary">
						+{overflow}
					</div>
				</div>
			)}
		</div>
	);
}

export { Avatar, AvatarGroup, avatarVariants, type AvatarProps };
export { AvatarSizes } from "./Avatar.constants";
