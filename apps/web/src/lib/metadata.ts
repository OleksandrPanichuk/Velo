import type { Metadata } from "next";

const SITE_NAME = "Velo";
const SITE_DESCRIPTION =
	"Project management built for speed. Track issues, run sprints, and ship faster with your whole team.";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export interface MetadataOptions {
	title?: string;
	description?: string;
	path?: string;
	image?: string;
	noIndex?: boolean;
	ogType?: "website" | "article";
}

export function createMetadata({
	title,
	description = SITE_DESCRIPTION,
	path,
	image = "/og.png",
	noIndex = false,
	ogType = "website",
}: MetadataOptions = {}): Metadata {
	const canonicalUrl = path != null ? `${APP_URL}${path === "/" ? "" : path}` : APP_URL;
	const ogImageUrl = image.startsWith("http") ? image : `${APP_URL}${image}`;
	const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

	return {
		metadataBase: new URL(APP_URL),

		title: title ? title : { default: SITE_NAME, template: `%s | ${SITE_NAME}` },

		description,

		openGraph: {
			title: fullTitle,
			description,
			url: canonicalUrl,
			siteName: SITE_NAME,
			locale: "en_US",
			type: ogType,
			images: [
				{
					url: ogImageUrl,
					width: 1200,
					height: 630,
					alt: fullTitle,
				},
			],
		},

		twitter: {
			card: "summary_large_image",
			title: fullTitle,
			description,
			images: [ogImageUrl],
		},

		alternates: {
			canonical: canonicalUrl,
		},

		robots: noIndex
			? { index: false, follow: false }
			: {
					index: true,
					follow: true,
					googleBot: {
						index: true,
						follow: true,
						"max-video-preview": -1,
						"max-image-preview": "large",
						"max-snippet": -1,
					},
				},
	};
}
