import { Button, ButtonSizes } from "@repo/ui";

interface WorkspaceStepProps {
	workspaceName: string;
	workspaceSlug: string;
	onNameChange: (v: string) => void;
	onContinue: () => void;
}

export function WorkspaceStep({
	workspaceName,
	workspaceSlug,
	onNameChange,
	onContinue,
}: WorkspaceStepProps) {
	return (
		<div className="flex flex-col gap-8">
			<div className="flex flex-col items-center gap-5 text-center">
				<div className="bg-brand-500/10 ring-brand-500/20 relative flex size-16 items-center justify-center rounded-2xl ring-1">
					<svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
						<rect
							x="4"
							y="12"
							width="24"
							height="16"
							rx="2"
							stroke="rgb(139 92 246)"
							strokeWidth="1.5"
						/>
						<path
							d="M10 12V9a6 6 0 0 1 12 0v3"
							stroke="rgb(139 92 246)"
							strokeWidth="1.5"
							strokeLinecap="round"
						/>
						<circle cx="16" cy="20" r="2" fill="rgb(139 92 246)" />
					</svg>
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
				<div className="flex flex-col gap-1.5">
					<label className="text-text-primary text-sm font-medium">Workspace name</label>
					<input
						type="text"
						placeholder="Acme Corp"
						value={workspaceName}
						onChange={(e) => onNameChange(e.target.value)}
						className="border-border bg-surface text-text-primary placeholder:text-text-tertiary focus:ring-brand-500/30 focus:border-brand-500 w-full rounded-lg border px-3.5 py-2.5 text-sm transition-all duration-150 outline-none focus:ring-2"
						autoFocus
					/>
				</div>

				<div className="flex flex-col gap-1.5">
					<label className="text-text-primary text-sm font-medium">Workspace URL</label>
					<div className="border-border bg-surface focus-within:ring-brand-500/30 focus-within:border-brand-500 flex items-center overflow-hidden rounded-lg border transition-all duration-150 focus-within:ring-2">
						<span className="border-border text-text-tertiary shrink-0 border-r px-3 py-2.5 text-sm">
							velo.app/
						</span>
						<input
							type="text"
							value={workspaceSlug}
							readOnly
							className="text-text-primary placeholder:text-text-tertiary w-full bg-transparent px-3 py-2.5 text-sm outline-none"
							placeholder="acme-corp"
						/>
					</div>
				</div>
			</div>

			<Button
				size={ButtonSizes.Large}
				fullWidth
				onClick={onContinue}
				disabled={!workspaceName.trim()}
			>
				Continue
			</Button>
		</div>
	);
}
