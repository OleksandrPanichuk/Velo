import { useState } from "react";

import { useRouter } from "next/navigation";

import { useForm } from "@tanstack/react-form";

import { ROUTES } from "@/constants";
import { OnboardingFormSchema, OnboardingFormValues } from "@/features/onboarding/schemas";
import { useCreateWorkspaceMutation } from "@/graphql/hooks";

export type OnboardingFormApi = ReturnType<typeof useOnboardingForm>["form"];

export const useOnboardingForm = () => {
	const [createWorkspace, { loading: isCreatingWorkspace }] = useCreateWorkspaceMutation();
	const router = useRouter();
	const [serverError, setServerError] = useState<string | undefined>();

	const form = useForm({
		defaultValues: {
			name: "",
			slug: "",
			role: null,
			size: null,
		} as OnboardingFormValues,
		onSubmit: async ({ value }) => {
			setServerError(undefined);
			try {
				const { data } = await createWorkspace({
					variables: {
						input: {
							name: value.name,
							slug: value.slug,
							size: value.size ?? null,
							jobRole: value.role ?? null,
						},
					},
				});
				if (data?.createWorkspace) {
					router.push(ROUTES.workspace.root(data.createWorkspace.slug));
				}
			} catch (err) {
				const message =
					err instanceof Error ? err.message : "Something went wrong. Please try again.";

				setServerError(message.replace("ApolloError: ", ""));
			}
		},
	});

	const loading = form.state.isSubmitting || isCreatingWorkspace;

	const resetError = () => {
		setServerError(undefined);
	};

	return {
		form,
		loading,
		serverError,
		resetError,
	};
};
