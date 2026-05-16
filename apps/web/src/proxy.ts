import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "velo:access_token";

export function proxy(request: NextRequest) {
	const hasToken = request.cookies.has(COOKIE_NAME);

	if (!hasToken) {
		const loginUrl = new URL("/login", request.url);
		loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
		return NextResponse.redirect(loginUrl);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/onboarding", "/settings/:path*", "/:workspaceSlug/:path*"],
};