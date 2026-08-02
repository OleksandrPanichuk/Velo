"use client";

import { Badge, BadgeSizes, Button, ButtonSizes, ButtonVariants, Spinner } from "@repo/ui";

import { InboxEmptyState } from "@/features/notifications/ui/components/InboxEmptyState";
import { NotificationItem } from "@/features/notifications/ui/components/NotificationItem";
import { useInbox } from "@/features/notifications/ui/views/InboxView/InboxView.hooks";

import { InboxViewHarness } from "./InboxView.harness";

interface InboxViewProps {
	workspaceId: string;
}

export function InboxView({ workspaceId }: InboxViewProps) {
	const { notifications, unreadCount, loading, isMarkingAll, error, markAsRead, markAllAsRead } =
		useInbox(workspaceId);

	return (
		<div
			data-qa={InboxViewHarness.Root}
			className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-8"
		>
			<header className="flex items-start justify-between gap-4">
				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-2">
						<h1
							data-qa={InboxViewHarness.Heading}
							className="text-text-primary text-xl font-semibold tracking-tight"
						>
							Inbox
						</h1>
						{unreadCount > 0 && (
							<Badge data-qa={InboxViewHarness.UnreadBadge} size={BadgeSizes.Medium}>
								{unreadCount} unread
							</Badge>
						)}
					</div>
					<p className="text-text-secondary text-sm">Updates from your workspace.</p>
				</div>

				{unreadCount > 0 && (
					<Button
						data-qa={InboxViewHarness.MarkAllAsRead}
						variant={ButtonVariants.Outline}
						size={ButtonSizes.Large}
						loading={isMarkingAll}
						onClick={() => void markAllAsRead()}
					>
						Mark all as read
					</Button>
				)}
			</header>

			<div className="border-border bg-surface rounded-xl border">
				{loading && !notifications.length ? (
					<div className="text-text-secondary flex items-center justify-center gap-2 px-4 py-16 text-sm">
						<Spinner />
						Loading your inbox…
					</div>
				) : error ? (
					<p
						data-qa={InboxViewHarness.Error}
						role="alert"
						className="px-4 py-16 text-center text-sm text-red-500"
					>
						{error}
					</p>
				) : notifications.length ? (
					<ul data-qa={InboxViewHarness.List} className="flex flex-col">
						{notifications.map((notification) => (
							<NotificationItem
								key={notification.id}
								notification={notification}
								onMarkAsRead={(id) => void markAsRead(id)}
							/>
						))}
					</ul>
				) : (
					<InboxEmptyState />
				)}
			</div>
		</div>
	);
}
