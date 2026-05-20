import type { Meta, StoryObj } from "@storybook/react";
import { Avatar, AvatarGroup, AvatarSizes } from ".";

const meta = {
	title: "Primitives/Avatar",
	component: Avatar,
	tags: ["autodocs"],
	argTypes: {
		size: { control: "select", options: ["xs", "sm", "md", "lg", "xl", "2xl"] },
	},
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithImage: Story = {
	args: {
		src: "https://i.pravatar.cc/150?img=1",
		alt: "Alex Morgan",
		size: AvatarSizes.Medium,
	},
};

export const WithFallback: Story = {
	args: { fallback: "Alex Morgan", size: AvatarSizes.Medium },
};

export const AllSizes: Story = {
	render: () => (
		<div className="flex items-end gap-3">
			<Avatar fallback="AK" size={AvatarSizes.XSmall} />
			<Avatar fallback="AK" size={AvatarSizes.Small} />
			<Avatar fallback="AK" size={AvatarSizes.Medium} />
			<Avatar fallback="AK" size={AvatarSizes.Large} />
			<Avatar fallback="AK" size={AvatarSizes.XLarge} />
			<Avatar fallback="AK" size={AvatarSizes.XXLarge} />
		</div>
	),
};

export const Group: StoryObj = {
	render: () => (
		<AvatarGroup max={3}>
			<Avatar src="https://i.pravatar.cc/150?img=1" fallback="AM" />
			<Avatar src="https://i.pravatar.cc/150?img=2" fallback="BK" />
			<Avatar src="https://i.pravatar.cc/150?img=3" fallback="CL" />
			<Avatar src="https://i.pravatar.cc/150?img=4" fallback="DM" />
			<Avatar src="https://i.pravatar.cc/150?img=5" fallback="EN" />
		</AvatarGroup>
	),
};
