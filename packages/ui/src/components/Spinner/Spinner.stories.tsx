import type { Meta, StoryObj } from "@storybook/react";
import { Spinner, SpinnerSizes } from ".";

const meta = {
	title: "Primitives/Spinner",
	component: Spinner,
	tags: ["autodocs"],
	argTypes: {
		size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
	},
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { size: SpinnerSizes.Medium } };

export const AllSizes: Story = {
	render: () => (
		<div className="flex items-center gap-4 text-text-secondary">
			<Spinner size={SpinnerSizes.XSmall} />
			<Spinner size={SpinnerSizes.Small} />
			<Spinner size={SpinnerSizes.Medium} />
			<Spinner size={SpinnerSizes.Large} />
			<Spinner size={SpinnerSizes.XLarge} />
		</div>
	),
};

export const BrandColor: Story = {
	render: () => <Spinner size={SpinnerSizes.Medium} className="text-brand-default" />,
};
