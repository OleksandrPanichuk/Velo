import { ROUTES } from "@/constants";
import { ACCEPT_INVITE_TOKEN_PARAM, INVITE_TOKEN_PARAM } from "@/features/invite/constants";

export function acceptInvitePath(token: string) {
	return `${ROUTES.auth.invite}?${ACCEPT_INVITE_TOKEN_PARAM}=${encodeURIComponent(token)}`;
}

export function withInviteToken(path: string, token: string | undefined) {
	if (!token) return path;

	return `${path}?${INVITE_TOKEN_PARAM}=${encodeURIComponent(token)}`;
}
