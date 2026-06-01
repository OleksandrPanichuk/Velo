"use client";

import { Button, ButtonSizes, ButtonVariants } from "@repo/ui";
import { Users } from "lucide-react";

import {
	ROLES,
	TEAM_SIZES,
} from "@/features/onboarding/ui/views/OnboardingView/OnboardingView.constants";
import type { OnboardingFormApi } from "@/features/onboarding/ui/views/OnboardingView/OnboardingView.hooks";

interface AboutStepProps {
	form: OnboardingFormApi;
	onContinue: () => void;
}

export function AboutStep({ form, onContinue }: AboutStepProps) {
	return (
		<div className="flex flex-col gap-8">
			<div className="flex flex-col items-center gap-5 text-center">
				<div className="bg-brand-500/10 ring-brand-500/20 relative flex size-16 items-center justify-center rounded-2xl ring-1">
					<Users className="text-brand-500 size-7" strokeWidth={1.5} />
					<div
						className="bg-brand-400 absolute -top-1 -right-1 size-3 rounded-full ring-2 ring-white"
						aria-hidden
					/>
				</div>

				<div className="flex flex-col gap-1.5">
					<h1 className="text-text-primary text-2xl font-semibold tracking-tight">
						Tell us about yourself
					</h1>
					<p className="text-text-secondary text-sm leading-relaxed">
						This helps us tailor your experience
						<br />
						right from the start.
					</p>
				</div>
			</div>

			<div className="flex flex-col gap-6">
				<form.Field name="role">
					{(field) => (
						<div className="flex flex-col gap-2.5">
							<p className="text-text-secondary text-xs font-medium tracking-wider uppercase">
								Your role
							</p>
							<div className="grid grid-cols-2 gap-2.5">
								{ROLES.map(({ id, label, Icon }) => {
									const active = field.state.value === id;
									return (
										<button
											key={id}
											type="button"
											onClick={() => field.handleChange(id)}
											className={`flex flex-col items-start gap-3 rounded-xl border p-3.5 text-left transition-all duration-150 ${
												active
													? "border-brand-500 bg-brand-500/8 ring-brand-500/20 ring-1"
													: "border-border bg-surface hover:border-border-strong hover:bg-surface-subtle"
											}`}
										>
											<div
												className={`flex size-8 items-center justify-center rounded-lg transition-colors duration-150 ${
													active ? "bg-brand-500/15" : "bg-surface-muted"
												}`}
											>
												<Icon
													className={`size-4 transition-colors duration-150 ${active ? "text-brand-500" : "text-text-secondary"}`}
													strokeWidth={1.75}
												/>
											</div>
											<span
												className={`text-sm font-medium transition-colors duration-150 ${active ? "text-brand-500" : "text-text-primary"}`}
											>
												{label}
											</span>
										</button>
									);
								})}
							</div>
						</div>
					)}
				</form.Field>

				<form.Field name="size">
					{(field) => (
						<div className="flex flex-col gap-2.5">
							<p className="text-text-secondary text-xs font-medium tracking-wider uppercase">
								Team size
							</p>
							<div className="flex gap-2">
								{TEAM_SIZES.map(({ id, label }) => {
									const active = field.state.value === id;
									return (
										<button
											key={id}
											type="button"
											onClick={() => field.handleChange(id)}
											className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-150 ${
												active
													? "border-brand-500 bg-brand-500/8 text-brand-500 ring-brand-500/20 ring-1"
													: "border-border bg-surface text-text-secondary hover:border-border-strong hover:text-text-primary"
											}`}
										>
											{label}
										</button>
									);
								})}
							</div>
						</div>
					)}
				</form.Field>
			</div>

			<div className="flex flex-col gap-2.5">
				<Button size={ButtonSizes.Large} onClick={onContinue} fullWidth>
					Continue
				</Button>
				<Button
					size={ButtonSizes.Large}
					variant={ButtonVariants.Ghost}
					onClick={onContinue}
					fullWidth
				>
					Skip for now
				</Button>
			</div>
		</div>
	);
}
