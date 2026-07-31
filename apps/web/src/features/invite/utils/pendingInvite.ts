const PENDING_INVITE_KEY = "velo:pending-invite";

/**
 * OAuth leaves the app entirely and the API redirects back to a fixed URL, so an
 * invite token cannot survive in the querystring. It is parked here for the
 * round trip and cleared as soon as it is read.
 */
export function storePendingInviteToken(token: string) {
	try {
		window.sessionStorage.setItem(PENDING_INVITE_KEY, token);
	} catch {
		// storage unavailable (private mode, blocked) — the invite link still works manually
	}
}

export function takePendingInviteToken(): string | null {
	try {
		const token = window.sessionStorage.getItem(PENDING_INVITE_KEY);
		window.sessionStorage.removeItem(PENDING_INVITE_KEY);
		return token;
	} catch {
		return null;
	}
}
