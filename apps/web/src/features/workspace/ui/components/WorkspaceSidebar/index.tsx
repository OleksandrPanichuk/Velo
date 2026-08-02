"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Badge, BadgeSizes, BadgeVariants, cn } from "@repo/ui";
import { Menu, X } from "lucide-react";

import type { UserFieldsFragment, WorkspaceBaseFragment } from "@/graphql/types";

import { WorkspaceSwitcher } from "../WorkspaceSwitcher";
import { WorkspaceUserMenu } from "../WorkspaceUserMenu";
import { WORKSPACE_NAV_GROUPS } from "./WorkspaceSidebar.constants";
import { WorkspaceSidebarHarness } from "./WorkspaceSidebar.harness";

type WorkspaceSidebarProps = {
	workspace: WorkspaceBaseFragment;
	workspaces: WorkspaceBaseFragment[];
	currentUser: UserFieldsFragment;
};

function isActive(pathname: string, href: string) {
	return pathname === href || pathname.startsWith(`${href}/`);
}

export function WorkspaceSidebar({ workspace, workspaces, currentUser }: WorkspaceSidebarProps) {
	const pathname = usePathname();
	const [isOpen, setIsOpen] = useState(false);
	const [isDesktop, setIsDesktop] = useState(true);

	useEffect(() => {
		setIsOpen(false);
	}, [pathname]);

	useEffect(() => {
		const query = window.matchMedia("(min-width: 768px)");

		const sync = () => setIsDesktop(query.matches);
		sync();
		query.addEventListener("change", sync);

		return () => query.removeEventListener("change", sync);
	}, []);

	return (
		<>
			<header
				data-qa={WorkspaceSidebarHarness.MobileHeader}
				className="border-border bg-surface sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b px-4 md:hidden"
			>
				<button
					type="button"
					data-qa={WorkspaceSidebarHarness.MobileOpen}
					aria-label="Open navigation"
					aria-expanded={isOpen}
					onClick={() => setIsOpen(true)}
					className="text-text-secondary hover:bg-surface-muted hover:text-text-primary rounded-md p-1.5 transition-colors duration-100"
				>
					<Menu className="size-5" />
				</button>
				<span
					data-qa={WorkspaceSidebarHarness.WorkspaceName}
					className="text-text-primary truncate text-sm font-semibold"
				>
					{workspace.name}
				</span>
			</header>

			{isOpen && (
				<button
					type="button"
					data-qa={WorkspaceSidebarHarness.MobileOverlay}
					aria-label="Close navigation"
					onClick={() => setIsOpen(false)}
					className="fixed inset-0 z-30 bg-neutral-950/50 md:hidden"
				/>
			)}

			<aside
				data-qa={WorkspaceSidebarHarness.Root}
				inert={!isOpen && !isDesktop}
				className={cn(
					"bg-surface-subtle border-border fixed inset-y-0 left-0 z-40 flex w-64 max-w-[85vw] shrink-0 -translate-x-full flex-col border-r transition-transform duration-200 md:sticky md:top-0 md:z-auto md:h-svh md:max-w-none md:translate-x-0 md:transition-none",
					isOpen && "translate-x-0",
				)}
			>
				<div className="flex h-14 shrink-0 items-center gap-1 px-2">
					<WorkspaceSwitcher
						workspace={workspace}
						workspaces={workspaces}
						className="min-w-0 flex-1"
					/>
					<button
						type="button"
						data-qa={WorkspaceSidebarHarness.MobileClose}
						aria-label="Close navigation"
						onClick={() => setIsOpen(false)}
						className="text-text-secondary hover:bg-surface-muted hover:text-text-primary rounded-md p-1.5 transition-colors duration-100 md:hidden"
					>
						<X className="size-4" />
					</button>
				</div>

				<nav data-qa={WorkspaceSidebarHarness.Nav} className="flex-1 overflow-y-auto px-2 py-2">
					{WORKSPACE_NAV_GROUPS.map((group) => (
						<div key={group.id} className="mb-4 last:mb-0">
							{group.label && (
								<p className="text-text-tertiary px-2 pt-1 pb-1.5 text-[11px] font-medium tracking-wide uppercase">
									{group.label}
								</p>
							)}

							<ul className="flex flex-col gap-0.5">
								{group.items.map((item) => {
									const Icon = item.icon;

									if (!("href" in item)) {
										return (
											<li key={item.label}>
												<span
													data-qa={WorkspaceSidebarHarness.NavPlaceholder}
													aria-disabled="true"
													className="text-text-tertiary flex cursor-not-allowed items-center gap-2.5 rounded-md px-2 py-1.5 text-sm select-none"
												>
													<Icon className="size-4 shrink-0" />
													<span className="min-w-0 flex-1 truncate">{item.label}</span>
													<Badge variant={BadgeVariants.Secondary} size={BadgeSizes.Small}>
														Soon
													</Badge>
												</span>
											</li>
										);
									}

									const href = item.href(workspace.slug);
									const active = isActive(pathname, href);

									return (
										<li key={item.label}>
											<Link
												data-qa={WorkspaceSidebarHarness.NavLink}
												href={href}
												aria-current={active ? "page" : undefined}
												className={cn(
													"flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors duration-100",
													active
														? "bg-surface-muted text-text-primary font-medium"
														: "text-text-secondary hover:bg-surface-muted hover:text-text-primary",
												)}
											>
												<Icon className="size-4 shrink-0" />
												<span className="min-w-0 flex-1 truncate">{item.label}</span>
											</Link>
										</li>
									);
								})}
							</ul>
						</div>
					))}
				</nav>

				<div className="border-border shrink-0 border-t p-2">
					<WorkspaceUserMenu currentUser={currentUser} />
				</div>
			</aside>
		</>
	);
}
