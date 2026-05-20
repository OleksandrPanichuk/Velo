import type { Meta, StoryObj } from "@storybook/react";
import { Progress, ProgressColors } from ".";

const meta = {
	title: "Primitives/Progress",
	component: Progress,
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<div className="w-64">
				<Story />
			</div>
		),
	],
	argTypes: {
		value: { control: { type: "range", min: 0, max: 100, step: 1 } },
		color: { control: "select", options: ["brand", "green", "yellow", "red"] },
		size: { control: "select", options: ["xs", "sm", "md"] },
		showLabel: { control: "boolean" },
	},
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { value: 65, showLabel: true },
};

export const CycleProgress: Story = {
	render: () => (
		<div className="flex flex-col gap-3">
			<div>
				<div className="mb-1.5 flex justify-between text-xs text-text-secondary">
					<span>Sprint 12</span>
					<span>18 / 24 issues</span>
				</div>
				<Progress value={18} max={24} color={ProgressColors.Green} showLabel />
			</div>
			<div>
				<div className="mb-1.5 flex justify-between text-xs text-text-secondary">
					<span>Sprint 13</span>
					<span>5 / 20 issues</span>
				</div>
				<Progress value={5} max={20} color={ProgressColors.Yellow} showLabel />
			</div>
		</div>
	),
};

export const Colors: Story = {
	render: () => (
		<div className="flex flex-col gap-3">
			<Progress value={70} color={ProgressColors.Brand} showLabel />
			<Progress value={70} color={ProgressColors.Green} showLabel />
			<Progress value={70} color={ProgressColors.Yellow} showLabel />
			<Progress value={70} color={ProgressColors.Red} showLabel />
		</div>
	),
};
