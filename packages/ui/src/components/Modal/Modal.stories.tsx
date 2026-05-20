import type { Meta, StoryObj } from "@storybook/react";
import { Modal } from "./index";
import { Button, ButtonVariants } from "../Button";
import * as React from "react";

const meta: Meta<typeof Modal> = {
	title: "Components/Modal",
	component: Modal,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Modal>;

function DefaultModalPreview() {
	const [isOpen, setIsOpen] = React.useState(false);

	return (
		<div>
			<Button onClick={() => setIsOpen(true)}>Open Modal</Button>
			<Modal
				open={isOpen}
				onClose={() => setIsOpen(false)}
				title="Edit Profile"
				description="Make changes to your profile here. Click save when you're done."
			>
				<div className="py-4">
					<div className="text-sm text-text-secondary">Modal content goes here...</div>
				</div>
				<div className="flex justify-end gap-2">
					<Button variant={ButtonVariants.Outline} onClick={() => setIsOpen(false)}>
						Cancel
					</Button>
					<Button onClick={() => setIsOpen(false)}>Save changes</Button>
				</div>
			</Modal>
		</div>
	);
}

export const Default: Story = {
	render: () => <DefaultModalPreview />,
};
