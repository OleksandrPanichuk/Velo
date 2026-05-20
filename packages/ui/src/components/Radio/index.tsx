import * as React from "react";

import { cn } from "../../lib/cn";

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
	label?: string;
	description?: string;
	error?: string;
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
	({ className, label, description, error, id, disabled, ...props }, ref) => {
		const generatedId = React.useId();
		const inputId = id || generatedId;
		const descriptionId = description ? `${inputId}-description` : undefined;
		const errorId = error ? `${inputId}-error` : undefined;
		const describedBy =
			[props["aria-describedby"], errorId ?? descriptionId].filter(Boolean).join(" ") || undefined;

		return (
			<div className="flex items-start gap-2">
				<div className="relative flex h-5 items-center">
					<input
						type="radio"
						id={inputId}
						ref={ref}
						disabled={disabled}
						className={cn(
							"peer border-border size-4 shrink-0 appearance-none rounded-full border bg-transparent shadow-sm",
							"focus-visible:ring-brand-500 focus-visible:ring-offset-surface focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none",
							"disabled:cursor-not-allowed disabled:opacity-50",
							"checked:border-brand-default",
							error && "border-red-500 focus-visible:ring-red-500",
							className,
						)}
						aria-invalid={error ? true : props["aria-invalid"]}
						aria-describedby={describedBy}
						{...props}
					/>
					<div className="pointer-events-none absolute inset-0 hidden items-center justify-center peer-checked:flex">
						<div className="bg-brand-default size-2 rounded-full" />
					</div>
				</div>
				{(label || description) && (
					<div className="mt-0.5 grid gap-1.5 leading-none">
						{label && (
							<label
								htmlFor={inputId}
								className={cn(
									"text-text-primary cursor-pointer text-sm leading-none font-medium",
									disabled && "cursor-not-allowed opacity-70",
								)}
							>
								{label}
							</label>
						)}
						{description && (
							<p id={descriptionId} className="text-text-secondary text-sm">
								{description}
							</p>
						)}
						{error && (
							<p id={errorId} className="text-xs text-red-500">
								{error}
							</p>
						)}
					</div>
				)}
			</div>
		);
	},
);
Radio.displayName = "Radio";

export { Radio };
