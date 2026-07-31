import { Avatar, AvatarSizes } from "@repo/ui";

import { RoleBadge } from "@/features/workspace/ui/components/RoleBadge";
import type { WorkspaceMemberBaseFragment } from "@/graphql/types";
import { formatDate } from "@/utils/date";

interface MemberRowProps {
	member: WorkspaceMemberBaseFragment;
	isCurrentUser: boolean;
}

export function MemberRow({ member, isCurrentUser }: MemberRowProps) {
	const { user } = member;

	return (
		<li className="border-border flex items-center gap-4 border-b px-4 py-3 last:border-b-0">
			<Avatar
				size={AvatarSizes.XLarge}
				src={user.avatarUrl ?? undefined}
				fallback={user.fullName}
				alt={user.fullName}
			/>

			<div className="flex min-w-0 flex-1 flex-col">
				<div className="flex items-center gap-2">
					<span className="text-text-primary truncate text-sm font-medium">{user.fullName}</span>
					{isCurrentUser && <span className="text-text-tertiary text-xs">(you)</span>}
				</div>
				<span className="text-text-secondary truncate text-xs">{user.email}</span>
			</div>

			<div>
				<span className="text-text-tertiary text-xs">Joined {formatDate(member.joinedAt)}</span>
			</div>

			<RoleBadge role={member.role} />
		</li>
	);
}
