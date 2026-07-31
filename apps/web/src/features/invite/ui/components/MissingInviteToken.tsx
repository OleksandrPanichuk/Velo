import Link from "next/link";

import { Button, ButtonSizes, ButtonVariants } from "@repo/ui";
import { XCircle } from "lucide-react";

import { ROUTES } from "@/constants";

import { InviteMessage } from "./InviteMessage";

export function MissingInviteToken() {
	return (
		<InviteMessage
			icon={<XCircle className="size-10 text-red-500" />}
			title="Invalid invite link"
			description="This invite link is missing its token. Ask whoever invited you to send the link again."
		>
			<Button variant={ButtonVariants.Outline} size={ButtonSizes.Large} asChild fullWidth>
				<Link href={ROUTES.auth.login}>Back to sign in</Link>
			</Button>
		</InviteMessage>
	);
}
