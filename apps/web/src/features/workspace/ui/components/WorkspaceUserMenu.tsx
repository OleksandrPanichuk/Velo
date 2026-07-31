"use client";

import {
	Avatar,
	AvatarSizes,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@repo/ui";
import { ChevronsUpDown, LogOut } from "lucide-react";

import { ROUTES } from "@/constants";
import { useSignOutMutation } from "@/graphql/hooks";
import type { UserFieldsFragment } from "@/graphql/types";

type WorkspaceUserMenuProps = {
	currentUser: UserFieldsFragment;
};

export function WorkspaceUserMenu({ currentUser }: WorkspaceUserMenuProps) {
	const [signOut, { loading }] = useSignOutMutation();

	const handleSignOut = async () => {
		try {
			await signOut();
		} finally {
			window.location.href = ROUTES.auth.login;
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="hover:bg-surface-muted focus-visible:ring-brand-500 flex w-full items-center gap-2 rounded-md px-1.5 py-1.5 transition-colors duration-100 outline-none focus-visible:ring-2">
				<Avatar
					size={AvatarSizes.Small}
					src={currentUser.avatarUrl ?? undefined}
					fallback={currentUser.fullName}
				/>
				<span className="min-w-0 flex-1 text-left">
					<span className="text-text-primary block truncate text-sm font-medium">
						{currentUser.fullName}
					</span>
					<span className="text-text-tertiary block truncate text-xs">{currentUser.email}</span>
				</span>
				<ChevronsUpDown className="text-text-tertiary size-3.5 shrink-0" />
			</DropdownMenuTrigger>

			<DropdownMenuContent align="start" side="top" className="w-56">
				<div className="px-2 py-1.5">
					<p className="text-text-primary truncate text-sm font-medium">{currentUser.fullName}</p>
					<p className="text-text-tertiary truncate text-xs">{currentUser.email}</p>
				</div>

				<DropdownMenuSeparator />

				<DropdownMenuItem
					disabled={loading}
					onSelect={handleSignOut}
					className="cursor-pointer gap-2 text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
				>
					<LogOut className="size-3.5" />
					Sign out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
