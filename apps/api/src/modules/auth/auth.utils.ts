import type { CookieNames } from "@/constants";
import type { Request } from "express";

export const extractFromCookie =
	(cookieName: CookieNames) =>
	(req: Request): string | null => {
		const cookies = req.cookies as Record<string, string | undefined> | undefined;
		return cookies?.[cookieName] ?? null;
	};
