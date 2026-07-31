import Link from "next/link";

import { Button, ButtonSizes, ButtonVariants } from "@repo/ui";
import { Users } from "lucide-react";

import { ROUTES } from "@/constants";
import { withInviteToken } from "@/features/invite/utils";

import { InviteMessage } from "./InviteMessage";

interface Props {
	token: string;
}

export function InviteAuthPrompt({ token }: Props) {
	return (
		<InviteMessage
			icon={<Users className="text-brand-500 size-10" />}
			title="You've been invited to Velo"
			description="Create your account to join the workspace. Use the email address the invite was sent to."
		>
			<Button size={ButtonSizes.Large} asChild fullWidth>
				<Link href={withInviteToken(ROUTES.auth.register, token)}>Create account</Link>
			</Button>
			<Button variant={ButtonVariants.Outline} size={ButtonSizes.Large} asChild fullWidth>
				<Link href={withInviteToken(ROUTES.auth.login, token)}>I already have an account</Link>
			</Button>
		</InviteMessage>
	);
}
