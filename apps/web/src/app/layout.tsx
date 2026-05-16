import { Geist, Geist_Mono } from "next/font/google";

import type { Metadata } from "next";

import { GetCurrentUserDocument } from "@/graphql";
import { PreloadQuery } from "@/lib/apollo";
import { createMetadata } from "@/lib/metadata";
import { ApolloProvider } from "@/providers";

import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = createMetadata();

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
			<body className="flex min-h-full flex-col">
				<ApolloProvider>
					<PreloadQuery query={GetCurrentUserDocument}>{children}</PreloadQuery>
				</ApolloProvider>
			</body>
		</html>
	);
}
