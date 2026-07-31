import { type PropsWithChildren } from "react";

import Link from "next/link";

import { ArrowLeft, CheckCircle2 } from "lucide-react";

import { VeloMark } from "@/components/icons";
import { ROUTES } from "@/constants";
import { getCurrentUserFn } from "@/features/users/server";

const FEATURES = [
	"Issues, cycles, and roadmaps in one place",
	"Real-time collaboration for your whole team",
	"Powerful analytics and sprint insights",
] as const;

export async function AuthLayout({ children }: PropsWithChildren) {
	const currentUser = await getCurrentUserFn();

	return (
		<div className="flex min-h-screen">
			<aside className="relative hidden w-115 shrink-0 overflow-hidden bg-neutral-950 lg:flex lg:flex-col">
				<div className="bg-brand-600/20 absolute top-1/4 left-0 h-80 w-80 -translate-x-1/3 rounded-full blur-3xl" />
				<div className="bg-brand-500/15 absolute right-0 bottom-1/4 h-64 w-64 translate-x-1/3 rounded-full blur-3xl" />

				<div
					aria-hidden="true"
					className="absolute inset-0"
					style={{
						backgroundImage: "radial-gradient(circle, rgba(139,92,246,0.12) 1px, transparent 1px)",
						backgroundSize: "28px 28px",
					}}
				/>

				<div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-neutral-950 to-transparent" />
				<div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-neutral-950 to-transparent" />

				<div className="relative flex h-full flex-col p-10">
					<div className="flex items-center gap-2.5">
						<VeloMark />
						<span className="text-lg font-semibold tracking-tight text-white">Velo</span>
					</div>

					<div className="flex flex-1 flex-col justify-center">
						<div className="border-brand-500/25 bg-brand-500/10 mb-6 inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1">
							<span className="bg-brand-400 size-1.5 rounded-full" />
							<span className="text-brand-300 text-xs font-medium">Now in early access</span>
						</div>

						<h1 className="text-[2.625rem] leading-[1.15] font-bold tracking-tight text-white">
							Move fast,
							<br />
							<span className="from-brand-400 to-brand-300 bg-linear-to-r bg-clip-text text-transparent">
								ship better.
							</span>
						</h1>

						<p className="mt-5 max-w-[18rem] text-base leading-relaxed text-neutral-400">
							The project management tool built for engineering teams who move at speed.
						</p>

						<ul className="mt-9 space-y-3.5">
							{FEATURES.map((feature) => (
								<li key={feature} className="flex items-center gap-3">
									<CheckCircle2 className="text-brand-400 size-4 shrink-0" />
									<span className="text-sm text-neutral-300">{feature}</span>
								</li>
							))}
						</ul>
					</div>
				</div>
			</aside>

			<div className="bg-surface flex flex-1 flex-col">
				<header className="flex items-center justify-between px-6 py-5">
					<Link href="/" className="flex items-center gap-2 lg:hidden">
						<VeloMark className="size-7" />
						<span className="text-text-primary font-semibold">Velo</span>
					</Link>

					<div className="hidden lg:block" />

					<Link
						href={ROUTES.root}
						className="text-text-secondary hover:text-text-primary flex items-center gap-1.5 text-sm transition-colors duration-100"
					>
						<ArrowLeft className="size-3.5" />
						Back to home
					</Link>
				</header>

				<main className="flex flex-1 items-center justify-center px-4 pt-4 pb-20">
					<div className="w-full max-w-88">{children}</div>
				</main>
			</div>
		</div>
	);
}
