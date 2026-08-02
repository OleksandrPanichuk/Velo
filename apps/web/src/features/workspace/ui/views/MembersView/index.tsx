import { notFound } from "next/navigation";

import { InviteManagement } from "@/features/invite/ui/views/InviteManagement";
import { getCurrentUserFn } from "@/features/users/server";
import { INVITE_MANAGING_ROLES } from "@/features/workspace/constants";
import { getMembersFn, getWorkspaceBySlugFn } from "@/features/workspace/server";
import { MemberRow } from "@/features/workspace/ui/components/MemberRow";

import { MembersViewHarness } from "./MembersView.harness";

interface MembersViewProps {
	slug: string;
}

export async function MembersView({ slug }: MembersViewProps) {
	const workspace = await getWorkspaceBySlugFn(slug);

	if (!workspace) {
		notFound();
	}

	const [members, currentUser] = await Promise.all([
		getMembersFn(workspace.id),
		getCurrentUserFn(),
	]);

	const viewer = members.find((member) => member.user.id === currentUser?.id);
	const canManageInvites = !!viewer && INVITE_MANAGING_ROLES.includes(viewer.role);

	return (
		<div
			data-qa={MembersViewHarness.Root}
			className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-8"
		>
			<header className="flex flex-col gap-1">
				<h1
					data-qa={MembersViewHarness.Heading}
					className="text-text-primary text-xl font-semibold tracking-tight"
				>
					Members
				</h1>
				<p className="text-text-secondary text-sm">People with access to {workspace.name}.</p>
			</header>

			<section className="flex flex-col gap-3">
				<h2
					data-qa={MembersViewHarness.TeamHeading}
					className="text-text-primary text-sm font-semibold"
				>
					Team {members.length > 0 && `(${members.length})`}
				</h2>

				<div className="border-border bg-surface rounded-xl border">
					<ul data-qa={MembersViewHarness.List} className="flex flex-col">
						{members.map((member) => (
							<MemberRow
								key={member.id}
								member={member}
								isCurrentUser={member.user.id === currentUser?.id}
							/>
						))}
					</ul>
				</div>
			</section>

			{canManageInvites && <InviteManagement workspaceId={workspace.id} />}
		</div>
	);
}
