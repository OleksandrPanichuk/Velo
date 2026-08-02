import type { PropsWithChildren, ReactNode } from "react";

import { InviteMessageHarness } from "./InviteMessage.harness";

interface Props {
	icon: ReactNode;
	title: string;
	description: ReactNode;
}

export function InviteMessage({ icon, title, description, children }: PropsWithChildren<Props>) {
	return (
		<div data-qa={InviteMessageHarness.Root} className="flex flex-col items-center gap-6 text-center">
			{icon}
			<div className="flex flex-col gap-1">
				<h2
					data-qa={InviteMessageHarness.Title}
					className="text-text-primary text-2xl font-semibold tracking-tight"
				>
					{title}
				</h2>
				<p data-qa={InviteMessageHarness.Description} className="text-text-secondary text-sm">
					{description}
				</p>
			</div>
			{children && (
				<div data-qa={InviteMessageHarness.Actions} className="flex w-full flex-col gap-2.5">
					{children}
				</div>
			)}
		</div>
	);
}
