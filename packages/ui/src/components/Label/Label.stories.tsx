import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "./index";
import { Input } from "../Input";
import * as React from "react";

const meta: Meta<typeof Label> = {
	title: "Components/Label",
	component: Label,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
	args: {
		children: "Email address",
		htmlFor: "email",
	},
};

export const WithInput: Story = {
	render: () => (
		<div className="flex flex-col gap-2">
			<Label htmlFor="email2">Email address</Label>
			<Input id="email2" type="email" placeholder="john@example.com" />
		</div>
	),
};
