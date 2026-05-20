import * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "../../lib/cn";
import { Spinner } from "../Spinner";
import { SpinnerSizes } from "../Spinner/Spinner.constants";
import { useRipple } from "./Button.hooks";
import { ButtonSizes, ButtonVariants } from "./Button.constants";

const buttonVariants = cva(
	[
		"relative overflow-hidden inline-flex items-center justify-center gap-1.5 whitespace-nowrap font-medium select-none cursor-pointer",
		"transition-colors duration-100",
		"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1",
		"focus-visible:ring-offset-surface",
		"disabled:pointer-events-none disabled:opacity-50",
	],
	{
		variants: {
			variant: {
				[ButtonVariants.Default]:
					"rounded-md bg-brand-default text-brand-on hover:bg-brand-strong active:bg-brand-strong",
				[ButtonVariants.Secondary]:
					"rounded-md bg-surface-muted text-text-primary hover:bg-neutral-200 dark:hover:bg-neutral-750",
				[ButtonVariants.Ghost]:
					"rounded-md text-text-secondary hover:bg-surface-muted hover:text-text-primary",
				[ButtonVariants.Outline]:
					"rounded-md border border-border text-text-primary hover:bg-surface-subtle",
				[ButtonVariants.Destructive]:
					"rounded-md bg-red-500 text-white hover:bg-red-600 active:bg-red-700",
				[ButtonVariants.Link]:
					"h-auto p-0 text-brand-default underline-offset-4 hover:underline overflow-visible",
			},
			size: {
				[ButtonSizes.Small]: "h-6 px-2 text-xs",
				[ButtonSizes.Medium]: "h-7 px-2.5 text-sm",
				[ButtonSizes.Large]: "h-8 px-3 text-sm",
				[ButtonSizes.IconSmall]: "size-6",
				[ButtonSizes.IconMedium]: "size-7",
				[ButtonSizes.IconLarge]: "size-8",
			},
		},
		defaultVariants: { variant: ButtonVariants.Default, size: ButtonSizes.Medium },
	},
);

interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	href?: string;
	loading?: boolean;
	disableRipple?: boolean;
	fullWidth?: boolean;
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant,
			size,
			asChild = false,
			href,
			loading = false,
			disableRipple = false,
			fullWidth = false,
			leftIcon,
			rightIcon,
			disabled,
			type,
			children,
			onMouseDown,
			...props
		},
		ref,
	) => {
		const { ripples, addRipple } = useRipple();

		const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
			if (!disableRipple && variant !== ButtonVariants.Link && !disabled && !loading) {
				addRipple(e);
			}
			onMouseDown?.(e);
		};

		const innerContent = (
			<>
				{loading && <Spinner size={SpinnerSizes.XSmall} className="shrink-0" />}
				{!loading && leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
				{children}
				{!loading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
			</>
		);

		if (asChild) {
			const child = React.Children.only(children) as React.ReactElement<{
				children?: React.ReactNode;
			}>;
			return (
				<Slot
					ref={ref}
					className={cn(buttonVariants({ variant, size }), fullWidth && "w-full", className)}
					{...props}
				>
					{React.cloneElement(child, {
						children: (
							<>
								{leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
								{child.props.children}
								{rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
							</>
						),
					})}
				</Slot>
			);
		}

		if (href) {
			return (
				<a
					ref={ref as React.Ref<HTMLAnchorElement>}
					href={href}
					className={cn(buttonVariants({ variant, size }), fullWidth && "w-full", className)}
					{...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
				>
					{innerContent}
				</a>
			);
		}

		return (
			<button
				ref={ref}
				type={type ?? "button"}
				className={cn(buttonVariants({ variant, size }), fullWidth && "w-full", className)}
				disabled={disabled || loading}
				onMouseDown={handleMouseDown}
				aria-busy={loading || undefined}
				{...props}
			>
				{innerContent}
				{!disableRipple && variant !== ButtonVariants.Link && (
					<span className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
						{ripples.map((ripple) => (
							<span
								key={ripple.id}
								className="animate-ripple absolute rounded-full bg-white/30"
								style={{
									width: ripple.size,
									height: ripple.size,
									top: ripple.y,
									left: ripple.x,
								}}
							/>
						))}
					</span>
				)}
			</button>
		);
	},
);
Button.displayName = "Button";

export { Button, buttonVariants, type ButtonProps, ButtonSizes, ButtonVariants };
