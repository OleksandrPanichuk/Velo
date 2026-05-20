import type { Meta, StoryObj } from "@storybook/react"
import { Input } from "."

const meta = {
  title: "Primitives/Input",
  component: Input,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { placeholder: "Issue title…" },
}

export const WithLabel: Story = {
  args: { label: "Email address", placeholder: "you@example.com", type: "email" },
}

export const WithHint: Story = {
  args: {
    label: "Workspace slug",
    placeholder: "acme-corp",
    hint: "Used in your workspace URL: velo.app/acme-corp",
  },
}

export const WithError: Story = {
  args: {
    label: "Email address",
    placeholder: "you@example.com",
    defaultValue: "notanemail",
    error: "Please enter a valid email address.",
  },
}

export const WithStartAdornment: Story = {
  args: {
    placeholder: "Search issues…",
    startAdornment: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="6.5" cy="6.5" r="4" />
        <path d="M11 11l2.5 2.5" strokeLinecap="round" />
      </svg>
    ),
  },
}

export const Disabled: Story = {
  args: { label: "Username", defaultValue: "oleksandr", disabled: true },
}
