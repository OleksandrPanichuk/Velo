import { Lock } from "lucide-react";
import { notFound } from "next/navigation";

import { WORKSPACE_SIZE_LABELS } from "@/features/workspace/constants";
import { getWorkspaceDetailsFn } from "@/features/workspace/server";
import { env } from "@/lib/env";
import { formatDate } from "@/utils/date";

import { WorkspaceSettingsViewHarness } from "./WorkspaceSettingsView.harness";

interface WorkspaceSettingsViewProps {
	slug: string;
}

export async function WorkspaceSettingsView({ slug }: WorkspaceSettingsViewProps) {
	const workspace = await getWorkspaceDetailsFn(slug);

	if (!workspace) {
		notFound();
	}

	const details = [
		{ label: "Name", value: workspace.name },
		{ label: "URL", value: `${env.NEXT_PUBLIC_APP_URL.replace(/^https?:\/\//, "")}/${workspace.slug}` },
		{
			label: "Team size",
			value: workspace.size ? WORKSPACE_SIZE_LABELS[workspace.size] : "Not set",
		},
		{ label: "Created", value: formatDate(workspace.createdAt) },
	];

	return (
		<div
			data-qa={WorkspaceSettingsViewHarness.Root}
			className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-8"
		>
			<header className="flex flex-col gap-1">
				<h1
					data-qa={WorkspaceSettingsViewHarness.Heading}
					className="text-text-primary text-xl font-semibold tracking-tight"
				>
					Workspace settings
				</h1>
				<p className="text-text-secondary text-sm">Details for {workspace.name}.</p>
			</header>

			<div
				data-qa={WorkspaceSettingsViewHarness.ReadOnlyNotice}
				className="border-border bg-surface flex items-start gap-3 rounded-xl border p-4"
			>
				<Lock className="text-text-tertiary mt-0.5 size-4 shrink-0" />
				<div className="flex flex-col gap-1">
					<p className="text-text-primary text-sm font-medium">Editing is not available yet</p>
					<p className="text-text-secondary text-xs leading-relaxed">
						The API has no mutation for updating a workspace, so these values are read-only. Once
						it ships, this page will let you change them.
					</p>
				</div>
			</div>

			<dl className="border-border bg-surface flex flex-col rounded-xl border">
				{details.map(({ label, value }) => (
					<div
						key={label}
						data-qa={WorkspaceSettingsViewHarness.DetailRow}
						className="border-border flex flex-col gap-1 border-b px-4 py-3 last:border-b-0 sm:flex-row sm:items-center sm:gap-4"
					>
						<dt
							data-qa={WorkspaceSettingsViewHarness.DetailLabel}
							className="text-text-secondary text-xs font-medium sm:w-40 sm:shrink-0"
						>
							{label}
						</dt>
						<dd data-qa={WorkspaceSettingsViewHarness.DetailValue} className="text-text-primary text-sm">
							{value}
						</dd>
					</div>
				))}
			</dl>
		</div>
	);
}
