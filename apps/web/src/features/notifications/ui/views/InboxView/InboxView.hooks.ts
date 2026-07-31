"use client";

import { useState } from "react";

import {
	useGetNotificationsQuery,
	useMarkAllNotificationsAsReadMutation,
	useMarkNotificationAsReadMutation,
} from "@/graphql/hooks";

function toMessage(err: unknown) {
	const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";

	return message.replace("ApolloError: ", "");
}

export function useInbox(workspaceId: string) {
	const { data, loading, error, refetch } = useGetNotificationsQuery({
		variables: { workspaceId },
		errorPolicy: "all",
	});
	const [markAsRead] = useMarkNotificationAsReadMutation();
	const [markAllAsRead, { loading: isMarkingAll }] = useMarkAllNotificationsAsReadMutation();
	const [actionError, setActionError] = useState<string | undefined>();

	const notifications = data?.notifications ?? [];
	const unreadCount = notifications.filter((notification) => !notification.isRead).length;

	const handleMarkAsRead = async (id: string) => {
		setActionError(undefined);
		try {
			await markAsRead({ variables: { id } });
		} catch (err) {
			setActionError(toMessage(err));
		}
	};

	const handleMarkAllAsRead = async () => {
		setActionError(undefined);
		try {
			await markAllAsRead({ variables: { workspaceId } });
			await refetch();
		} catch (err) {
			setActionError(toMessage(err));
		}
	};

	return {
		notifications,
		unreadCount,
		loading,
		isMarkingAll,
		error: error ? toMessage(error) : actionError,
		markAsRead: handleMarkAsRead,
		markAllAsRead: handleMarkAllAsRead,
	};
}
