import { env } from "./env";

export function generateApiUrl(url: string): string {
	const path = url.startsWith("/") ? url : `/${url}`;
	return `${env.NEXT_PUBLIC_API_URL}/api${path}`;
}
