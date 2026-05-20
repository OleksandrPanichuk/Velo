import type { Meta, StoryObj } from "@storybook/react";

import { Badge, BadgeSizes, BadgeVariants } from ".";

const meta = {
	title: "Primitives/Badge",
	component: Badge,
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "select",
			options: [
				"default",
				"secondary",
				"outline",
				"success",
				"warning",
				"destructive",
				"urgent",
				"high",
				"medium",
				"low",
			],
		},
		size: { control: "select", options: ["sm", "md"] },
		dot: { control: "boolean" },
	},
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { children: "In Progress", variant: BadgeVariants.Default },
};

export const PriorityBadges: Story = {
	render: () => (
		<div className="flex flex-wrap gap-2">
			<Badge variant={BadgeVariants.Urgent} dot>
				Urgent
			</Badge>
			<Badge variant={BadgeVariants.High} dot>
				High
			</Badge>
			<Badge variant={BadgeVariants.Medium} dot>
				Medium
			</Badge>
			<Badge variant={BadgeVariants.Low} dot>
				Low
			</Badge>
			<Badge variant={BadgeVariants.Secondary} dot>
				No priority
			</Badge>
		</div>
	),
};

export const StatusBadges: Story = {
	render: () => (
		<div className="flex flex-wrap gap-2">
			<Badge variant={BadgeVariants.Success} dot>
				Completed
			</Badge>
			<Badge variant={BadgeVariants.Warning} dot>
				At risk
			</Badge>
			<Badge variant={BadgeVariants.Destructive} dot>
				Cancelled
			</Badge>
			<Badge variant={BadgeVariants.Secondary} dot>
				Backlog
			</Badge>
		</div>
	),
};

export const AllVariants: Story = {
	render: () => (
		<div className="flex flex-wrap gap-2">
			<Badge variant={BadgeVariants.Default}>Default</Badge>
			<Badge variant={BadgeVariants.Secondary}>Secondary</Badge>
			<Badge variant={BadgeVariants.Outline}>Outline</Badge>
			<Badge variant={BadgeVariants.Success}>Success</Badge>
			<Badge variant={BadgeVariants.Warning}>Warning</Badge>
			<Badge variant={BadgeVariants.Destructive}>Destructive</Badge>
		</div>
	),
};

export const Sizes: Story = {
	render: () => (
		<div className="flex items-center gap-2">
			<Badge size={BadgeSizes.Small}>Small</Badge>
			<Badge size={BadgeSizes.Medium}>Medium</Badge>
		</div>
	),
};
