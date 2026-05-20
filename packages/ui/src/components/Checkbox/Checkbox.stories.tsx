import type { Meta, StoryObj } from "@storybook/react";

import { Checkbox } from "./index";

const meta: Meta<typeof Checkbox> = {
	title: "Components/Checkbox",
	component: Checkbox,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
	args: {
		label: "Accept terms and conditions",
	},
};

export const WithDescription: Story = {
	args: {
		label: "Subscribe to newsletter",
		description: "We will send you a weekly digest of our best content.",
	},
};

export const Disabled: Story = {
	args: {
		label: "Not available",
		disabled: true,
	},
};

export const CheckedDisabled: Story = {
	args: {
		label: "Pre-selected option",
		checked: true,
		disabled: true,
	},
};
