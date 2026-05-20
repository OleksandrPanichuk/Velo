import { Geist, Geist_Mono } from "next/font/google";

import type { Metadata } from "next";

import { getCurrentUserFn } from "@/features/users/server";
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

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const currentUser = await getCurrentUserFn();
	console.log("layout", { currentUser });
	return (
		<html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
			<body className="flex min-h-full flex-col">
				<ApolloProvider>{children}</ApolloProvider>
			</body>
		</html>
	);
}
