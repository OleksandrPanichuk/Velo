import { Badge, BadgeSizes, BadgeVariants } from "@repo/ui";

import { MEMBER_ROLE_LABELS } from "@/features/workspace/constants";
import type { WorkspaceInviteRole, WorkspaceMemberRole } from "@/graphql/types";

import { RoleBadgeHarness } from "./RoleBadge.harness";

interface RoleBadgeProps {
	role: WorkspaceMemberRole | WorkspaceInviteRole;
}

const ROLE_VARIANTS: Record<WorkspaceMemberRole, BadgeVariants> = {
	OWNER: BadgeVariants.Neutral,
	ADMIN: BadgeVariants.Warning,
	MEMBER: BadgeVariants.Secondary,
	GUEST: BadgeVariants.Outline,
};

export function RoleBadge({ role }: RoleBadgeProps) {
	return (
		<Badge data-qa={RoleBadgeHarness.Badge} variant={ROLE_VARIANTS[role]} size={BadgeSizes.Medium}>
			{MEMBER_ROLE_LABELS[role]}
		</Badge>
	);
}
