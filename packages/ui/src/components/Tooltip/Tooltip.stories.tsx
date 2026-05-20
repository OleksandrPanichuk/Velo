import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip, TooltipProvider } from ".";
import { Button, ButtonSizes, ButtonVariants } from "../Button";

const meta = {
	title: "Primitives/Tooltip",
	component: Tooltip,
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<TooltipProvider>
				<Story />
			</TooltipProvider>
		),
	],
	parameters: { layout: "centered" },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		content: "Create a new issue",
		children: <Button variant={ButtonVariants.Outline}>Hover me</Button>,
	},
};

export const Positions: StoryObj = {
	render: () => (
		<TooltipProvider>
			<div className="grid grid-cols-3 gap-4 p-8">
				<div />
				<Tooltip content="Top tooltip" side="top">
					<Button variant={ButtonVariants.Outline} size={ButtonSizes.Small}>
						Top
					</Button>
				</Tooltip>
				<div />
				<Tooltip content="Left tooltip" side="left">
					<Button variant={ButtonVariants.Outline} size={ButtonSizes.Small}>
						Left
					</Button>
				</Tooltip>
				<div />
				<Tooltip content="Right tooltip" side="right">
					<Button variant={ButtonVariants.Outline} size={ButtonSizes.Small}>
						Right
					</Button>
				</Tooltip>
				<div />
				<Tooltip content="Bottom tooltip" side="bottom">
					<Button variant={ButtonVariants.Outline} size={ButtonSizes.Small}>
						Bottom
					</Button>
				</Tooltip>
				<div />
			</div>
		</TooltipProvider>
	),
};
