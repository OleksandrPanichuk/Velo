import {
	FolderKanban,
	Inbox,
	type LucideIcon,
	Settings,
	SquareCheckBig,
	Star,
	Users,
	UsersRound,
} from "lucide-react";

import { ROUTES } from "@/constants";

type NavItemBase = {
	label: string;
	icon: LucideIcon;
};

export type WorkspaceNavItem =
	| (NavItemBase & { href: (slug: string) => string })
	| (NavItemBase & { comingSoon: true });

export type WorkspaceNavGroup = {
	id: string;
	label?: string;
	items: WorkspaceNavItem[];
};

export const WORKSPACE_NAV_GROUPS: WorkspaceNavGroup[] = [
	{
		id: "overview",
		items: [
			{ label: "Inbox", icon: Inbox, href: ROUTES.workspace.inbox },
			{ label: "My Issues", icon: SquareCheckBig, comingSoon: true },
			{ label: "Favorites", icon: Star, comingSoon: true },
		],
	},
	{
		id: "workspace",
		label: "Workspace",
		items: [
			{ label: "Projects", icon: FolderKanban, comingSoon: true },
			{ label: "Teams", icon: UsersRound, comingSoon: true },
			{ label: "Members", icon: Users, href: ROUTES.workspace.members },
			{ label: "Settings", icon: Settings, href: ROUTES.workspace.settings },
		],
	},
];
