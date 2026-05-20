"use client";

import { useState } from "react";

import { VeloMark } from "@/components/icons";
import { AboutStep } from "@/features/onboarding/ui/components/AboutStep";
import { ReadyStep } from "@/features/onboarding/ui/components/ReadyStep";
import { StepIndicator } from "@/features/onboarding/ui/components/StepIndicator";
import { WorkspaceStep } from "@/features/onboarding/ui/components/WorkspaceStep";

import styles from "./OnboardingView.module.css";

export type Step = 1 | 2 | 3;

export function OnboardingView() {
	const [step, setStep] = useState<Step>(1);
	const [workspaceName, setWorkspaceName] = useState("");
	const [selectedRole, setSelectedRole] = useState<string | null>(null);
	const [selectedSize, setSelectedSize] = useState<string | null>(null);

	const workspaceSlug = workspaceName
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");

	return (
		<div className="bg-surface relative flex min-h-screen flex-col overflow-hidden">
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
				<div className="flex items-center gap-2.5">
					<VeloMark className="size-7" />
					<span className="text-text-primary text-base font-semibold tracking-tight">Velo</span>
				</div>

				<StepIndicator current={step} />

				<div className="w-24" />
			</header>

			<main className="relative flex flex-1 items-center justify-center px-4 py-12">
				<div key={step} className={`${styles.stepContent} w-full max-w-md`}>
					{step === 1 && (
						<WorkspaceStep
							workspaceName={workspaceName}
							workspaceSlug={workspaceSlug}
							onNameChange={setWorkspaceName}
							onContinue={() => setStep(2)}
						/>
					)}
					{step === 2 && (
						<AboutStep
							selectedRole={selectedRole}
							selectedSize={selectedSize}
							onRoleSelect={setSelectedRole}
							onSizeSelect={setSelectedSize}
							onContinue={() => setStep(3)}
						/>
					)}
					{step === 3 && (
						<ReadyStep
							workspaceName={workspaceName || "My Workspace"}
							workspaceSlug={workspaceSlug || "my-workspace"}
						/>
					)}
				</div>
			</main>
		</div>
	);
}
