import type { Meta, StoryObj } from "@storybook/react";
import { Select } from ".";

const meta: Meta<typeof Select> = {
	title: "Components/Select",
	component: Select,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Select>;

const options = [
	{ value: "apple", label: "Apple" },
	{ value: "banana", label: "Banana" },
	{ value: "orange", label: "Orange" },
];

export const Default: Story = {
	args: {
		options,
		placeholder: "Select a fruit...",
	},
};

export const WithLabel: Story = {
	args: {
		label: "Fruit",
		options,
		placeholder: "Select a fruit...",
	},
};

export const MultiSelect: Story = {
	args: {
		label: "Fruits",
		options,
		isMulti: true,
		placeholder: "Select fruits...",
	},
};
