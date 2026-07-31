"use client";

import { createContext, type PropsWithChildren, useContext } from "react";

type ActiveWorkspaceProviderProps = PropsWithChildren<{
	workspaceId: string;
}>;

const ActiveWorkspaceIdContext = createContext<string | null>(null);

export function ActiveWorkspaceProvider({ workspaceId, children }: ActiveWorkspaceProviderProps) {
	return (
		<ActiveWorkspaceIdContext.Provider value={workspaceId}>
			{children}
		</ActiveWorkspaceIdContext.Provider>
	);
}

export function useActiveWorkspaceId() {
	const workspaceId = useContext(ActiveWorkspaceIdContext);

	if (!workspaceId) {
		throw new Error("useActiveWorkspaceId must be used inside an ActiveWorkspaceProvider");
	}

	return workspaceId;
}
