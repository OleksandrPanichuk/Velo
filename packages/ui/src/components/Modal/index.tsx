import * as React from "react";

import * as Dialog from "@radix-ui/react-dialog";

import { cn } from "../../lib/cn";

export interface ModalProps {
	open: boolean;
	onClose?: () => void;
	title?: string;
	description?: string;
	className?: string;
	overlayClassName?: string;
	size?: "sm" | "md" | "lg" | "xl" | "full";
	showCloseButton?: boolean;
	closeLabel?: string;
	children?: React.ReactNode;
}

export function Modal({
	open,
	onClose,
	title,
	description,
	className,
	overlayClassName,
	size = "md",
	showCloseButton = true,
	closeLabel = "Close",
	children,
}: ModalProps) {
	return (
		<Dialog.Root open={open} onOpenChange={(o) => !o && onClose?.()}>
			<Dialog.Portal>
				<Dialog.Overlay
					className={cn(
						"fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black/50 p-2 pt-10 backdrop-blur-sm sm:items-center sm:p-6",
						"data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out duration-200",
						overlayClassName,
					)}
				>
					<Dialog.Content
						onOpenAutoFocus={(e) => e.preventDefault()}
						className={cn(
							"bg-surface relative z-50 max-h-[calc(100vh-2rem)] w-[min(100%-1rem,56rem)] overflow-y-auto rounded-xl p-5 shadow-xl focus:outline-none sm:p-6",
							size === "sm" && "max-w-md",
							size === "md" && "max-w-lg",
							size === "lg" && "max-w-2xl",
							size === "xl" && "max-w-4xl",
							size === "full" && "max-w-[min(100%-1rem,80rem)]",
							"data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95 duration-200",
							className,
						)}
					>
						<div className="flex flex-col gap-4">
							{(title || description) && (
								<div className="flex flex-col gap-1">
									{title && (
										<Dialog.Title className="text-text-primary pr-8 text-lg font-semibold">
											{title}
										</Dialog.Title>
									)}
									{description && (
										<Dialog.Description className="text-text-secondary text-sm">
											{description}
										</Dialog.Description>
									)}
								</div>
							)}

							{showCloseButton && onClose && (
								<Dialog.Close
									className="text-text-secondary hover:bg-surface-muted hover:text-text-primary focus:ring-brand-500 focus:ring-offset-surface absolute top-4 right-4 rounded-md p-1 transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none"
									aria-label={closeLabel}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="size-4"
									>
										<path d="M18 6 6 18" />
										<path d="m6 6 12 12" />
									</svg>
									<span className="sr-only">{closeLabel}</span>
								</Dialog.Close>
							)}

							{children}
						</div>
					</Dialog.Content>
				</Dialog.Overlay>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
