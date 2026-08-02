"use client";

import { useState } from "react";

import { ChevronLeft } from "lucide-react";

import { VeloMark } from "@/components/icons";
import { AboutStep } from "@/features/onboarding/ui/components/AboutStep";
import { ReadyStep } from "@/features/onboarding/ui/components/ReadyStep";
import { StepIndicator } from "@/features/onboarding/ui/components/StepIndicator";
import { WorkspaceStep } from "@/features/onboarding/ui/components/WorkspaceStep";
import { OnboardingStep } from "@/features/onboarding/ui/views/OnboardingView/OnboardingView.constants";
import { useOnboardingForm } from "@/features/onboarding/ui/views/OnboardingView/OnboardingView.hooks";

import { OnboardingViewHarness } from "./OnboardingView.harness";
import styles from "./OnboardingView.module.css";

export function OnboardingView() {
	const { form, loading, serverError, resetError } = useOnboardingForm();
	const [step, setStep] = useState<OnboardingStep>(OnboardingStep.Workspace);

	const handleStep1Continue = async () => {
		const [nameErrors, slugErrors] = await Promise.all([
			form.validateField("name", "submit"),
			form.validateField("slug", "submit"),
		]);
		if (!nameErrors.length && !slugErrors.length) {
			setStep(OnboardingStep.About);
		}
	};

	const handleBack = () => {
		resetError();
		if (step === OnboardingStep.About) setStep(OnboardingStep.Workspace);
		else if (step === OnboardingStep.Ready) setStep(OnboardingStep.About);
	};

	return (
		<div
			data-qa={OnboardingViewHarness.Root}
			className="bg-surface relative flex min-h-screen flex-col overflow-hidden"
		>
			<div
				aria-hidden
				className="absolute inset-0 opacity-40"
				style={{
					backgroundImage: "radial-gradient(circle, rgba(139,92,246,0.07) 1px, transparent 1px)",
					backgroundSize: "24px 24px",
				}}
			/>
			<div
				aria-hidden
				className="bg-brand-400/10 absolute top-0 right-0 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
			/>
			<div
				aria-hidden
				className="absolute bottom-0 left-0 h-80 w-80 -translate-x-1/2 translate-y-1/2 rounded-full bg-violet-300/8 blur-3xl"
			/>

			<header className="relative flex items-center justify-between px-8 py-6">
				<div className="flex w-24 items-center">
					{step !== OnboardingStep.Workspace ? (
						<button
							type="button"
							data-qa={OnboardingViewHarness.Back}
							onClick={handleBack}
							className="text-text-secondary hover:text-text-primary flex items-center gap-1 text-sm transition-colors duration-150"
						>
							<ChevronLeft className="size-4" strokeWidth={2} />
							Back
						</button>
					) : (
						<div className="flex items-center gap-2.5">
							<VeloMark className="size-7" />
							<span className="text-text-primary text-base font-semibold tracking-tight">Velo</span>
						</div>
					)}
				</div>

				<StepIndicator current={step} />

				<div className="w-24" />
			</header>

			<main className="relative flex flex-1 items-center justify-center px-4 py-12">
				<div key={step} className={`${styles.stepContent} w-full max-w-md`}>
					{step === OnboardingStep.Workspace && (
						<WorkspaceStep form={form} onContinue={handleStep1Continue} />
					)}
					{step === OnboardingStep.About && (
						<AboutStep form={form} onContinue={() => setStep(OnboardingStep.Ready)} />
					)}
					{step === OnboardingStep.Ready && (
						<ReadyStep
							workspaceName={form.state.values.name}
							workspaceSlug={form.state.values.slug}
							loading={loading}
							error={serverError}
							onComplete={() => form.handleSubmit()}
							onBack={() => {
								resetError();
								setStep(OnboardingStep.Workspace);
							}}
						/>
					)}
				</div>
			</main>
		</div>
	);
}
