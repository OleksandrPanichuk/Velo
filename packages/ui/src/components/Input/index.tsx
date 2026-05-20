import * as React from "react";

import { cn } from "../../lib/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
	hint?: string;
	startAdornment?: React.ReactNode;
	endAdornment?: React.ReactNode;
	containerClassName?: string;
	labelClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	(
		{
			className,
			label,
			error,
			hint,
			startAdornment,
			endAdornment,
			id,
			disabled,
			containerClassName,
			labelClassName,
			...props
		},
		ref,
	) => {
		const uid = React.useId();
		const inputId = id ?? uid;
		const hintId = hint ? `${inputId}-hint` : undefined;
		const errorId = error ? `${inputId}-error` : undefined;
		const describedBy =
			[props["aria-describedby"], errorId ?? hintId].filter(Boolean).join(" ") || undefined;

		return (
			<div className={cn("flex w-full flex-col gap-1.5", containerClassName)}>
				{label && (
					<label
						htmlFor={inputId}
						className={cn("text-text-primary text-sm font-medium", labelClassName)}
					>
						{label}
					</label>
				)}
				<div className="relative flex items-center">
					{startAdornment && (
						<span className="text-text-tertiary absolute left-2.5 flex items-center [&_svg]:size-4">
							{startAdornment}
						</span>
					)}
					<input
						ref={ref}
						id={inputId}
						disabled={disabled}
						className={cn(
							"bg-surface text-text-primary h-8 w-full rounded-md border px-3 py-1 text-sm",
							"placeholder:text-text-tertiary",
							"border-border",
							"focus:border-brand-500 focus:ring-brand-500/20 focus:ring-2 focus:outline-none",
							"read-only:bg-surface-subtle read-only:text-text-secondary",
							"disabled:cursor-not-allowed disabled:opacity-50",
							"transition-colors duration-100",
							error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
							startAdornment && "pl-9",
							endAdornment && "pr-9",
							className,
						)}
						aria-invalid={error ? true : props["aria-invalid"]}
						aria-describedby={describedBy}
						{...props}
					/>
					{endAdornment && (
						<span className="text-text-tertiary absolute right-2.5 flex items-center [&_svg]:size-4">
							{endAdornment}
						</span>
					)}
				</div>
				{error && (
					<p id={errorId} className="text-xs text-red-500">
						{error}
					</p>
				)}
				{hint && !error && (
					<p id={hintId} className="text-text-tertiary text-xs">
						{hint}
					</p>
				)}
			</div>
		);
	},
);
Input.displayName = "Input";

export { Input, type InputProps };
