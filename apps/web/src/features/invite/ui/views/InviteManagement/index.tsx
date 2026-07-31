"use client";

import { InviteMemberForm } from "@/features/invite/ui/components/InviteMemberForm";
import { PendingInvitesList } from "@/features/invite/ui/components/PendingInvitesList";
import {
	useInviteMemberForm,
	usePendingInvites,
	useRevokeInvite,
} from "@/features/invite/ui/views/InviteManagement/InviteManagement.hooks";

interface InviteManagementProps {
	workspaceId: string;
}

export function InviteManagement({ workspaceId }: InviteManagementProps) {
	const { invites, loading, error, refetch } = usePendingInvites(workspaceId);
	const {
		form,
		loading: isInviting,
		serverError,
		invitedEmail,
	} = useInviteMemberForm(workspaceId, refetch);
	const { revoke, revokingId, serverError: revokeError } = useRevokeInvite(workspaceId, refetch);

	return (
		<div className="flex flex-col gap-8">
			<section className="flex flex-col gap-3">
				<div className="flex flex-col gap-1">
					<h2 className="text-text-primary text-sm font-semibold">Invite people</h2>
					<p className="text-text-secondary text-xs">
						They will get an email with a link to join this workspace.
					</p>
				</div>

				<InviteMemberForm
					form={form}
					loading={isInviting}
					serverError={serverError}
					invitedEmail={invitedEmail}
				/>
			</section>

			<section className="flex flex-col gap-3">
				<div className="flex items-center justify-between">
					<h2 className="text-text-primary text-sm font-semibold">
						Pending invites {invites.length > 0 && `(${invites.length})`}
					</h2>
				</div>

				<div className="border-border bg-surface rounded-xl border">
					<PendingInvitesList
						invites={invites}
						loading={loading && !invites.length}
						revokingId={revokingId}
						error={error ?? revokeError}
						onRevoke={(id) => void revoke(id)}
					/>
				</div>
			</section>
		</div>
	);
}
