"use client";

import Link from "next/link";

import {
	Avatar,
	AvatarSizes,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	cn,
} from "@repo/ui";
import { Check, ChevronsUpDown, Plus } from "lucide-react";

import { ROUTES } from "@/constants";
import type { WorkspaceBaseFragment } from "@/graphql/types";

type WorkspaceSwitcherProps = {
	workspace: WorkspaceBaseFragment;
	workspaces: WorkspaceBaseFragment[];
	className?: string;
};

export function WorkspaceSwitcher({ workspace, workspaces, className }: WorkspaceSwitcherProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				className={cn(
					"hover:bg-surface-muted focus-visible:ring-brand-500 flex items-center gap-2 rounded-md px-1.5 py-1.5 transition-colors duration-100 outline-none focus-visible:ring-2",
					className,
				)}
			>
				<Avatar
					size={AvatarSizes.Small}
					src={workspace.logo?.url}
					fallback={workspace.name}
					className="rounded-md"
				/>
				<span className="text-text-primary min-w-0 flex-1 truncate text-left text-sm font-semibold">
					{workspace.name}
				</span>
				<ChevronsUpDown className="text-text-tertiary size-3.5 shrink-0" />
			</DropdownMenuTrigger>

			<DropdownMenuContent align="start" className="w-60">
				<DropdownMenuLabel className="text-text-tertiary text-xs font-medium">
					Workspaces
				</DropdownMenuLabel>

				{workspaces.map((item) => (
					<DropdownMenuItem key={item.id} asChild>
						<Link href={ROUTES.workspace.root(item.slug)} className="cursor-pointer gap-2">
							<Avatar
								size={AvatarSizes.XSmall}
								src={item.logo?.url}
								fallback={item.name}
								className="rounded"
							/>
							<span className="min-w-0 flex-1 truncate">{item.name}</span>
							{item.id === workspace.id && <Check className="text-brand-500 size-3.5 shrink-0" />}
						</Link>
					</DropdownMenuItem>
				))}

				<DropdownMenuSeparator />

				<DropdownMenuItem asChild>
					<Link href={ROUTES.onboarding} className="text-text-secondary cursor-pointer gap-2">
						<Plus className="size-3.5" />
						Create workspace
					</Link>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
