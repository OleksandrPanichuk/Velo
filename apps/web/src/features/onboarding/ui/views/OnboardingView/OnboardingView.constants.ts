import { BarChart3, Code2, Layers, Paintbrush } from "lucide-react";

export const ROLES = [
	{ id: "developer", label: "Developer", Icon: Code2 },
	{ id: "designer", label: "Designer", Icon: Paintbrush },
	{ id: "pm", label: "Product Manager", Icon: BarChart3 },
	{ id: "other", label: "Other", Icon: Layers },
] as const;

export const TEAM_SIZES = ["1–5", "6–20", "21–50", "50+"] as const;

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
