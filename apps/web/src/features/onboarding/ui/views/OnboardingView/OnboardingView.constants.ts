import { BarChart3, Code2, Layers, Paintbrush } from "lucide-react";

import type { MemberJobRole, WorkspaceSize } from "@/graphql/types";

export const ROLES = [
	{ id: "DEVELOPER", label: "Developer", Icon: Code2 },
	{ id: "DESIGNER", label: "Designer", Icon: Paintbrush },
	{ id: "PM", label: "Product Manager", Icon: BarChart3 },
	{ id: "OTHER", label: "Other", Icon: Layers },
] as const satisfies readonly { id: MemberJobRole; label: string; Icon: unknown }[];

export const TEAM_SIZES = [
	{ id: "SMALL", label: "1–5" },
	{ id: "MEDIUM", label: "6–20" },
	{ id: "LARGE", label: "21–50" },
	{ id: "ENTERPRISE", label: "50+" },
] as const satisfies readonly { id: WorkspaceSize; label: string }[];

export const MOCK_ISSUES = [
	{ status: "done", label: "Design system foundation", priority: "high" },
	{ status: "in-progress", label: "Set up CI/CD pipeline", priority: "urgent" },
	{ status: "todo", label: "API rate limiting", priority: "medium" },
	{ status: "done", label: "User authentication flow", priority: "high" },
	{ status: "todo", label: "Write onboarding docs", priority: "low" },
] as const;

export const STATUS_COLORS: Record<string, string> = {
	done: "bg-emerald-500",
	"in-progress": "bg-violet-500",
	todo: "bg-neutral-400",
};

export enum OnboardingStep {
	Workspace = 1,
	About = 2,
	Ready = 3,
}
