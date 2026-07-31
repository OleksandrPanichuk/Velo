import type { Meta, StoryObj } from "@storybook/react";
import { Button, ButtonSizes, ButtonVariants } from ".";

const meta = {
	title: "Primitives/Button",
	component: Button,
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "select",
			options: ["default", "secondary", "ghost", "outline", "destructive", "link"],
		},
		size: {
			control: "select",
			options: ["sm", "md", "lg", "icon-sm", "icon-md", "icon-lg"],
		},
		loading: { control: "boolean" },
		disabled: { control: "boolean" },
	},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { children: "Create issue" },
};

export const Secondary: Story = {
	args: { children: "Cancel", variant: ButtonVariants.Secondary },
};

export const Ghost: Story = {
	args: { children: "Archive", variant: ButtonVariants.Ghost },
};

export const Outline: Story = {
	args: { children: "Filter", variant: ButtonVariants.Outline },
};

export const Destructive: Story = {
	args: { children: "Delete workspace", variant: ButtonVariants.Destructive },
};

export const Loading: Story = {
	args: { children: "Creating…", loading: true },
};

export const Disabled: Story = {
	args: { children: "Upgrade to Pro", disabled: true },
};

export const AllVariants: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-2">
			<Button variant={ButtonVariants.Default}>Default</Button>
			<Button variant={ButtonVariants.Secondary}>Secondary</Button>
			<Button variant={ButtonVariants.Ghost}>Ghost</Button>
			<Button variant={ButtonVariants.Outline}>Outline</Button>
			<Button variant={ButtonVariants.Destructive}>Destructive</Button>
			<Button variant={ButtonVariants.Link}>Link</Button>
		</div>
	),
};

export const AllSizes: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-2">
			<Button size={ButtonSizes.Small}>Small</Button>
			<Button size={ButtonSizes.Medium}>Medium</Button>
			<Button size={ButtonSizes.Large}>Large</Button>
		</div>
	),
};
