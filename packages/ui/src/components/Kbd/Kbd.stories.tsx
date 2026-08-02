import type { Meta, StoryObj } from "@storybook/react";
import { Kbd } from ".";

const meta = {
	title: "Primitives/Kbd",
	component: Kbd,
	tags: ["autodocs"],
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
	args: { children: "K" },
};

export const CommandPalette: Story = {
	render: () => (
		<div className="flex items-center gap-1 text-xs text-text-secondary">
			<span>Open command palette</span>
			<Kbd keys={["⌘", "K"]} />
		</div>
	),
};

export const CommonShortcuts: Story = {
	render: () => (
		<div className="flex flex-col gap-2 text-xs text-text-secondary">
			{[
				{ label: "New issue", keys: ["C"] },
				{ label: "Search", keys: ["⌘", "K"] },
				{ label: "Assign to me", keys: ["A"] },
				{ label: "Set priority", keys: ["P"] },
				{ label: "Set due date", keys: ["D"] },
				{ label: "Copy issue link", keys: ["⌘", "Shift", "C"] },
			].map(({ label, keys }) => (
				<div key={label} className="flex items-center justify-between gap-8">
					<span>{label}</span>
					<Kbd keys={keys} />
				</div>
			))}
		</div>
	),
};
