import * as React from "react";

import ReactSelect, { Props as SelectProps } from "react-select";

import { cn } from "../../lib/cn";

export interface CustomSelectProps extends SelectProps {
	label?: string;
	error?: string;
	hint?: string;
	"aria-describedby"?: string;
}

export function Select({
	label,
	error,
	hint,
	className,
	inputId,
	"aria-describedby": ariaDescribedBy,
	...props
}: CustomSelectProps) {
	const generatedId = React.useId();
	const resolvedInputId = inputId ?? generatedId;
	const hintId = hint ? `${resolvedInputId}-hint` : undefined;
	const errorId = error ? `${resolvedInputId}-error` : undefined;
	const describedBy = [ariaDescribedBy, errorId ?? hintId].filter(Boolean).join(" ") || undefined;

	return (
		<div className={cn("flex flex-col gap-1.5", className)}>
			{label && (
				<label htmlFor={resolvedInputId} className="text-text-primary text-sm font-medium">
					{label}
				</label>
			)}
			<ReactSelect
				{...props}
				inputId={resolvedInputId}
				aria-invalid={error ? true : props["aria-invalid"]}
				aria-describedby={describedBy}
				classNames={{
					control: ({ isFocused, isDisabled }) =>
						cn(
							"min-h-9 w-full rounded-md border border-border bg-surface px-3 py-1 text-sm shadow-sm transition-colors",
							isFocused
								? "outline-none ring-2 ring-brand-500 ring-offset-1 ring-offset-surface border-transparent"
								: "hover:border-neutral-400 dark:hover:border-neutral-600",
							isDisabled && "cursor-not-allowed opacity-60",
							error && "border-red-500 ring-red-500",
						),
					placeholder: () => "text-text-secondary",
					input: () => "text-text-primary",
					singleValue: () => "text-text-primary",
					valueContainer: () => "gap-1 py-0.5",
					menu: () =>
						"mt-1 rounded-md border border-border bg-surface-default shadow-md animate-in fade-in zoom-in-95",
					menuList: () => "p-1",
					noOptionsMessage: () => "px-2 py-2 text-xs text-text-secondary",
					loadingMessage: () => "px-2 py-2 text-xs text-text-secondary",
					option: ({ isFocused, isSelected }) =>
						cn(
							"relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none transition-colors",
							isFocused ? "bg-surface-muted text-text-primary" : "text-text-primary",
							isSelected ? "bg-brand-default/10 text-brand-default font-medium" : "",
						),
					multiValue: () => "bg-surface-muted rounded items-center px-1 mr-1",
					multiValueLabel: () => "text-xs text-text-primary px-1",
					multiValueRemove: () => "hover:bg-surface-hover hover:text-red-500 rounded-r-sm p-0.5",
					indicatorSeparator: () => "bg-border hidden",
					dropdownIndicator: () => "text-text-secondary hover:text-text-primary cursor-pointer p-1",
					clearIndicator: () => "text-text-secondary hover:text-red-500 cursor-pointer p-1",
					...props.classNames,
				}}
				styles={{
					menuPortal: (base) => ({ ...base, zIndex: 60 }),
					...props.styles,
				}}
				unstyled
			/>
			{error && (
				<span id={errorId} className="text-xs text-red-500">
					{error}
				</span>
			)}
			{hint && !error && (
				<span id={hintId} className="text-text-tertiary text-xs">
					{hint}
				</span>
			)}
		</div>
	);
}
