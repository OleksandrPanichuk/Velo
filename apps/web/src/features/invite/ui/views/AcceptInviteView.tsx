import { AcceptInvite } from "@/features/invite/ui/components/AcceptInvite";
import { InviteAuthPrompt } from "@/features/invite/ui/components/InviteAuthPrompt";
import { MissingInviteToken } from "@/features/invite/ui/components/MissingInviteToken";
import { getCurrentUserFn } from "@/features/users/server";

interface Props {
	token: string | undefined;
}

export async function AcceptInviteView({ token }: Props) {
	if (!token) return <MissingInviteToken />;

	const currentUser = await getCurrentUserFn();

	if (!currentUser) return <InviteAuthPrompt token={token} />;

	return <AcceptInvite token={token} currentEmail={currentUser.email} />;
}
