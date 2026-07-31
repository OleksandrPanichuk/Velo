"use client";

import { Avatar, AvatarSizes, Button, ButtonSizes, ButtonVariants } from "@repo/ui";
import { UserPlus } from "lucide-react";

import type { NotificationBaseFragment } from "@/graphql/types";
import { formatDateTime } from "@/utils/date";

interface NotificationItemProps {
	notification: NotificationBaseFragment;
	onMarkAsRead: (id: string) => void;
}

export function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
	const { actor, isRead } = notification;

	return (
		<li
			className={`border-border flex items-start gap-3 border-b px-4 py-3 last:border-b-0 ${
				isRead ? "bg-transparent" : "bg-brand-500/5"
			}`}
		>
			<span className="relative mt-0.5 flex shrink-0">
				{actor ? (
					<Avatar
						size={AvatarSizes.Large}
						src={actor.avatarUrl ?? undefined}
						fallback={actor.fullName}
						alt={actor.fullName}
					/>
				) : (
					<span className="bg-surface-muted flex size-8 items-center justify-center rounded-full">
						<UserPlus className="text-text-secondary size-4" />
					</span>
				)}
				{!isRead && (
					<span
						className="bg-brand-500 ring-surface absolute -top-0.5 -right-0.5 size-2.5 rounded-full ring-2"
						aria-hidden
					/>
				)}
			</span>

			<div className="flex min-w-0 flex-1 flex-col gap-0.5">
				<p
					className={`text-sm ${isRead ? "text-text-secondary" : "text-text-primary font-medium"}`}
				>
					{!isRead && <span className="sr-only">Unread: </span>}
					{notification.title}
				</p>
				{notification.body && (
					<p className="text-text-secondary text-xs leading-relaxed">{notification.body}</p>
				)}
				<span className="text-text-tertiary text-xs">
					{formatDateTime(notification.createdAt)}
				</span>
			</div>

			{!isRead && (
				<Button
					variant={ButtonVariants.Ghost}
					size={ButtonSizes.Small}
					onClick={() => onMarkAsRead(notification.id)}
				>
					Mark as read
				</Button>
			)}
		</li>
	);
}
