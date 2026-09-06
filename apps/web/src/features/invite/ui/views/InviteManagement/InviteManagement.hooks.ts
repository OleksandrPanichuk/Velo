"use client";

import { useState } from "react";

import { useForm } from "@tanstack/react-form";

import { InviteMemberFormSchema, type InviteMemberFormValues } from "@/features/invite/schemas";
import {
	useGetPendingInvitesQuery,
	useInviteMemberMutation,
	useRevokeInviteMutation,
} from "@/graphql/hooks";
import { workspaceContext } from "@/lib/apollo/workspace-context";

export type InviteFormApi = ReturnType<typeof useInviteMemberForm>["form"];

function toMessage(err: unknown) {
	const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";

	return message.replace("ApolloError: ", "");
}

export function usePendingInvites(workspaceId: string) {
	const { data, loading, error, refetch } = useGetPendingInvitesQuery({
		variables: { workspaceId },
		context: workspaceContext(workspaceId),
		errorPolicy: "all",
	});

	return {
		invites: data?.pendingInvites ?? [],
		loading,
		error: error ? toMessage(error) : undefined,
		refetch,
	};
}

export function useInviteMemberForm(workspaceId: string, onInvited: () => Promise<unknown>) {
	const [inviteMember, { loading: isInviting }] = useInviteMemberMutation();
	const [serverError, setServerError] = useState<string | undefined>();
	const [invitedEmail, setInvitedEmail] = useState<string | undefined>();

	const form = useForm({
		defaultValues: { email: "", role: "MEMBER" } as InviteMemberFormValues,
		onSubmit: async ({ value, formApi }) => {
			setServerError(undefined);
			setInvitedEmail(undefined);
			try {
				const { data } = await inviteMember({
					variables: { input: { workspaceId, email: value.email, role: value.role } },
					context: workspaceContext(workspaceId),
				});

				if (data?.inviteMember) {
					setInvitedEmail(data.inviteMember.email);
					formApi.reset();
					await onInvited();
				}
			} catch (err) {
				setServerError(toMessage(err));
			}
		},
	});

	return {
		form,
		schema: InviteMemberFormSchema,
		loading: form.state.isSubmitting || isInviting,
		serverError,
		invitedEmail,
	};
}

export function useRevokeInvite(workspaceId: string, onRevoked: () => Promise<unknown>) {
	const [revokeInvite] = useRevokeInviteMutation();
	const [revokingId, setRevokingId] = useState<string | undefined>();
	const [serverError, setServerError] = useState<string | undefined>();

	const revoke = async (id: string) => {
		setServerError(undefined);
		setRevokingId(id);
		try {
			await revokeInvite({ variables: { id }, context: workspaceContext(workspaceId) });
			await onRevoked();
		} catch (err) {
			setServerError(toMessage(err));
		} finally {
			setRevokingId(undefined);
		}
	};

	return { revoke, revokingId, serverError };
}
