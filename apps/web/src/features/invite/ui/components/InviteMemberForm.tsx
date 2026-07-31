"use client";

import { Button, ButtonSizes, Input, Select } from "@repo/ui";
import { Check, Mail } from "lucide-react";

import { INVITE_ROLE_VALUES, InviteMemberFormSchema } from "@/features/invite/schemas";
import type { InviteFormApi } from "@/features/invite/ui/views/InviteManagement/InviteManagement.hooks";
import { MEMBER_ROLE_LABELS } from "@/features/workspace/constants";

interface InviteMemberFormProps {
	form: InviteFormApi;
	loading: boolean;
	serverError?: string;
	invitedEmail?: string;
}

const ROLE_OPTIONS = INVITE_ROLE_VALUES.map((value) => ({
	value,
	label: MEMBER_ROLE_LABELS[value],
}));

function resolveRole(option: unknown) {
	if (!option || typeof option !== "object" || !("value" in option)) return null;

	return ROLE_OPTIONS.find((role) => role.value === option.value)?.value ?? null;
}

export function InviteMemberForm({
	form,
	loading,
	serverError,
	invitedEmail,
}: InviteMemberFormProps) {
	return (
		<form
			className="flex flex-col gap-3"
			onSubmit={(event) => {
				event.preventDefault();
				void form.handleSubmit();
			}}
		>
			<div className="flex flex-col gap-3 sm:flex-row sm:items-start">
				<div className="flex-1">
					<form.Field name="email" validators={{ onSubmit: InviteMemberFormSchema.shape.email }}>
						{(field) => (
							<Input
								type="email"
								placeholder="teammate@company.com"
								startAdornment={<Mail />}
								className="pl-8"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(event) => field.handleChange(event.target.value)}
								error={field.state.meta.errors[0]?.message}
							/>
						)}
					</form.Field>
				</div>

				<form.Field name="role">
					{(field) => (
						<Select
							className="sm:w-40"
							aria-label="Invite role"
							isSearchable={false}
							options={ROLE_OPTIONS}
							value={ROLE_OPTIONS.find((role) => role.value === field.state.value)}
							onChange={(option) => {
								const role = resolveRole(option);
								if (role) field.handleChange(role);
							}}
						/>
					)}
				</form.Field>

				<Button type="submit" size={ButtonSizes.Large} loading={loading}>
					Send invite
				</Button>
			</div>

			{serverError && <p className="text-xs text-red-500">{serverError}</p>}

			{!serverError && invitedEmail && (
				<p className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
					<Check className="size-3.5" />
					Invite sent to {invitedEmail}
				</p>
			)}
		</form>
	);
}
