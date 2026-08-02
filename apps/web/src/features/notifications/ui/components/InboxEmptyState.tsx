import { Inbox } from "lucide-react";

import { InboxEmptyStateHarness } from "./InboxEmptyState.harness";

export function InboxEmptyState() {
	return (
		<div
			data-qa={InboxEmptyStateHarness.Root}
			className="flex flex-col items-center gap-4 px-6 py-16 text-center"
		>
			<div className="bg-brand-500/10 ring-brand-500/20 flex size-14 items-center justify-center rounded-2xl ring-1">
				<Inbox className="text-brand-500 size-6" strokeWidth={1.5} />
			</div>

			<div className="flex max-w-sm flex-col gap-1.5">
				<p className="text-text-primary text-sm font-semibold">You&apos;re all caught up</p>
				<p className="text-text-secondary text-xs leading-relaxed">
					Nothing needs your attention. When someone joins this workspace, the update will land
					here.
				</p>
			</div>
		</div>
	);
}
