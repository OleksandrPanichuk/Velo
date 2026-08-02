"use client";

import { useEffect, useRef, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button, ButtonSizes, ButtonVariants } from "@repo/ui";
import { CheckCircle2, Clock, Loader2, MailWarning, XCircle } from "lucide-react";

import { ROUTES } from "@/constants";
import {
	type AcceptInviteFailure,
	classifyAcceptInviteError,
	withInviteToken,
} from "@/features/invite/utils";
import { useAcceptInviteMutation } from "@/graphql/hooks";

import { AcceptInviteHarness } from "./AcceptInvite.harness";
import { InviteMessage } from "./InviteMessage";

interface Props {
	token: string;
	currentEmail: string | null;
}

export function AcceptInvite({ token, currentEmail }: Props) {
	const [failure, setFailure] = useState<AcceptInviteFailure | null>(null);
	const [joinedWorkspaceName, setJoinedWorkspaceName] = useState<string | null>(null);
	const router = useRouter();

	const [acceptInvite] = useAcceptInviteMutation();
	const hasAcceptedRef = useRef(false);

	useEffect(() => {
		if (hasAcceptedRef.current) return;
		hasAcceptedRef.current = true;

		acceptInvite({ variables: { token } })
			.then(({ data }) => {
				const workspace = data?.acceptInvite;

				if (!workspace) {
					setFailure("unknown");
					return;
				}

				setJoinedWorkspaceName(workspace.name);
				router.replace(ROUTES.workspace.root(workspace.slug));
			})
			.catch((error: unknown) => setFailure(classifyAcceptInviteError(error)));
	}, [acceptInvite, router, token]);

	if (failure) {
		return <AcceptInviteFailureMessage failure={failure} token={token} email={currentEmail} />;
	}

	if (joinedWorkspaceName) {
		return (
			<InviteMessage
				icon={<CheckCircle2 className="text-brand-500 size-10" />}
				title={`Welcome to ${joinedWorkspaceName}`}
				description="Taking you to your new workspace…"
			/>
		);
	}

	return (
		<InviteMessage
			icon={<Loader2 className="text-brand-500 size-10 animate-spin" />}
			title="Joining the workspace"
			description="This will only take a moment…"
		/>
	);
}

interface FailureProps {
	failure: AcceptInviteFailure;
	token: string;
	email: string | null;
}

function AcceptInviteFailureMessage({ failure, token, email }: FailureProps) {
	if (failure === "wrongEmail") {
		return (
			<InviteMessage
				icon={<MailWarning className="size-10 text-amber-500" />}
				title="This invite is for another address"
				description={
					<>
						{email ? `You're signed in as ${email}, but this ` : "This "}
						invite was sent to a different email address. Sign in with the invited address to join
						the workspace.
					</>
				}
			>
				<Button size={ButtonSizes.Large} asChild fullWidth>
					<Link
						data-qa={AcceptInviteHarness.SignInWithInvitedAddress}
						href={withInviteToken(ROUTES.auth.login, token)}
					>
						Sign in with the invited address
					</Link>
				</Button>
			</InviteMessage>
		);
	}

	if (failure === "expired") {
		return (
			<InviteMessage
				icon={<Clock className="size-10 text-amber-500" />}
				title="This invite has expired"
				description="Invites are only valid for a limited time. Ask a workspace admin to send you a new one."
			>
				<BackToAppButton />
			</InviteMessage>
		);
	}

	if (failure === "alreadyAccepted") {
		return (
			<InviteMessage
				icon={<CheckCircle2 className="text-brand-500 size-10" />}
				title="This invite has already been used"
				description="If you already joined, you can open the workspace from your workspace list."
			>
				<Button size={ButtonSizes.Large} asChild fullWidth>
					<Link data-qa={AcceptInviteHarness.GoToMyWorkspaces} href={ROUTES.root}>
						Go to my workspaces
					</Link>
				</Button>
			</InviteMessage>
		);
	}

	if (failure === "notFound") {
		return (
			<InviteMessage
				icon={<XCircle className="size-10 text-red-500" />}
				title="Invite not found"
				description="This invite no longer exists — it may have been revoked. Ask a workspace admin to send you a new one."
			>
				<BackToAppButton />
			</InviteMessage>
		);
	}

	return (
		<InviteMessage
			icon={<XCircle className="size-10 text-red-500" />}
			title="Couldn't accept the invite"
			description="Something went wrong on our side. Please try the link again in a moment."
		>
			<BackToAppButton />
		</InviteMessage>
	);
}

function BackToAppButton() {
	return (
		<Button variant={ButtonVariants.Outline} size={ButtonSizes.Large} asChild fullWidth>
			<Link data-qa={AcceptInviteHarness.BackToApp} href={ROUTES.root}>
				Back to Velo
			</Link>
		</Button>
	);
}
