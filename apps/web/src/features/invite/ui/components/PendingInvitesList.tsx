"use client";

import { Button, ButtonSizes, ButtonVariants, Spinner, SpinnerSizes } from "@repo/ui";
import { MailCheck } from "lucide-react";

import { RoleBadge } from "@/features/workspace/ui/components/RoleBadge";
import type { WorkspaceInviteBaseFragment } from "@/graphql/types";
import { formatDate } from "@/utils/date";

import { PendingInvitesListHarness } from "./PendingInvitesList.harness";

interface PendingInvitesListProps {
	invites: WorkspaceInviteBaseFragment[];
	loading: boolean;
	revokingId?: string;
	error?: string;
	onRevoke: (id: string) => void;
}

export function PendingInvitesList({
	invites,
	loading,
	revokingId,
	error,
	onRevoke,
}: PendingInvitesListProps) {
	if (loading) {
		return (
			<div className="text-text-secondary flex items-center gap-2 px-4 py-6 text-sm">
				<Spinner size={SpinnerSizes.Small} />
				Loading pending invites…
			</div>
		);
	}

	if (error) {
		return (
			<p data-qa={PendingInvitesListHarness.Error} className="px-4 py-6 text-sm text-red-500">
				{error}
			</p>
		);
	}

	if (!invites.length) {
		return (
			<div
				data-qa={PendingInvitesListHarness.Empty}
				className="text-text-secondary flex items-center gap-2.5 px-4 py-6 text-sm"
			>
				<MailCheck className="text-text-tertiary size-4" />
				No invites waiting to be accepted.
			</div>
		);
	}

	return (
		<ul data-qa={PendingInvitesListHarness.Root} className="flex flex-col">
			{invites.map((invite) => (
				<li
					key={invite.id}
					data-qa={PendingInvitesListHarness.Row}
					className="border-border flex items-center gap-4 border-b px-4 py-3 last:border-b-0"
				>
					<div className="flex min-w-0 flex-1 flex-col">
						<span
							data-qa={PendingInvitesListHarness.RowEmail}
							className="text-text-primary truncate text-sm font-medium"
						>
							{invite.email}
						</span>
						<span className="text-text-secondary truncate text-xs">
							Invited by {invite.inviter.user.fullName} · expires {formatDate(invite.expiresAt)}
						</span>
					</div>

					<RoleBadge role={invite.role} />

					<Button
						data-qa={PendingInvitesListHarness.Revoke}
						variant={ButtonVariants.Ghost}
						size={ButtonSizes.Small}
						loading={revokingId === invite.id}
						onClick={() => onRevoke(invite.id)}
					>
						Revoke
					</Button>
				</li>
			))}
		</ul>
	);
}
