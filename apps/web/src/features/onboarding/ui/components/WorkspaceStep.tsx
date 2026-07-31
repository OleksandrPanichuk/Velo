"use client";

import { Button, ButtonSizes, Input } from "@repo/ui";

import { WorkspaceIcon } from "@/components/icons";
import { OnboardingFormSchema } from "@/features/onboarding/schemas";
import type { OnboardingFormApi } from "@/features/onboarding/ui/views/OnboardingView/OnboardingView.hooks";
import { toSlug } from "@/utils/common";

interface WorkspaceStepProps {
	form: OnboardingFormApi;
	onContinue: () => void;
}

export function WorkspaceStep({ form, onContinue }: WorkspaceStepProps) {
	return (
		<div className="flex flex-col gap-8">
			<div className="flex flex-col items-center gap-5 text-center">
				<div className="bg-brand-500/10 ring-brand-500/20 relative flex size-16 items-center justify-center rounded-2xl ring-1">
					<WorkspaceIcon />
					<div
						className="bg-brand-400 absolute -top-1 -right-1 size-3 rounded-full ring-2 ring-white"
						aria-hidden
					/>
				</div>

				<div className="flex flex-col gap-1.5">
					<h1 className="text-text-primary text-2xl font-semibold tracking-tight">
						Name your workspace
					</h1>
					<p className="text-text-secondary text-sm leading-relaxed">
						This is where your team&apos;s work lives.
						<br />
						You can always change it later.
					</p>
				</div>
			</div>

			<div className="flex flex-col gap-4">
				<form.Field name="name" validators={{ onSubmit: OnboardingFormSchema.shape.name }}>
					{(field) => (
						<Input
							label="Workspace name"
							placeholder="Acme Corp"
							autoFocus
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(e) => {
								field.handleChange(e.target.value);
								const slug = toSlug(e.target.value);
								if (slug || !e.target.value) form.setFieldValue("slug", slug);
							}}
							error={field.state.meta.errors[0]?.message}
						/>
					)}
				</form.Field>

				<form.Field name="slug" validators={{ onSubmit: OnboardingFormSchema.shape.slug }}>
					{(field) => (
						<div className="flex flex-col gap-1.5">
							<label className="text-text-primary text-sm font-medium">Workspace URL</label>
							<div
								className={`border-border bg-surface focus-within:ring-brand-500/30 focus-within:border-brand-500 flex items-center overflow-hidden rounded-lg border transition-all duration-150 focus-within:ring-2 ${
									field.state.meta.errors[0]
										? "border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20"
										: ""
								}`}
							>
								<span className="border-border text-text-tertiary shrink-0 border-r px-3 py-2.5 text-sm select-none">
									velo.app/
								</span>
								<input
									type="text"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									className="text-text-primary placeholder:text-text-tertiary w-full bg-transparent px-3 py-2.5 text-sm outline-none"
									placeholder="acme-corp"
								/>
							</div>
							{field.state.meta.errors[0] && (
								<p className="text-xs text-red-500">{field.state.meta.errors[0].message}</p>
							)}
						</div>
					)}
				</form.Field>
			</div>

			<Button size={ButtonSizes.Large} fullWidth onClick={onContinue}>
				Continue
			</Button>
		</div>
	);
}
