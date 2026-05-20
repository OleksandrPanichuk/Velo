import type { Meta, StoryObj } from "@storybook/react";
import { Radio } from ".";

const meta: Meta<typeof Radio> = {
	title: "Components/Radio",
	component: Radio,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Radio>;

export const Default: Story = {
	args: {
		name: "plan",
		label: "Free Plan",
		value: "free",
	},
};

export const WithDescription: Story = {
	args: {
		name: "plan",
		label: "Pro Plan",
		description: "$8/month. Access to all premium features.",
		value: "pro",
	},
};

export const Disabled: Story = {
	args: {
		name: "plan",
		label: "Enterprise Plan",
		disabled: true,
	},
};

export const CheckedDisabled: Story = {
	args: {
		name: "plan",
		label: "Current Plan",
		checked: true,
		disabled: true,
	},
};
