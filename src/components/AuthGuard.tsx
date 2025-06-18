// components/AuthGuard.tsx
"use client";

import { useSession } from "next-auth/react";
import { ReactNode } from "react";

type UserRole = "user" | "admin" | "moderator";

interface AuthGuardProps {
	children: ReactNode;
	requiredRole?: UserRole;
	requiredRoles?: UserRole[];
	requireActive?: boolean;
	minReputation?: number;
	fallback?: ReactNode;
}

export default function AuthGuard({
	children,
	requiredRole,
	requiredRoles,
	requireActive = false,
	minReputation = 0,
	fallback = <div>Access denied</div>,
}: AuthGuardProps) {
	const { data: session, status } = useSession();

	if (status === "loading") {
		return <div>Loading...</div>;
	}

	if (!session) {
		return <div>Please sign in to access this content</div>;
	}

	const user = session.user;

	// Check if user is active
	if (requireActive && !user.isActive) {
		return <div>Account is inactive. Please contact support.</div>;
	}

	// Check reputation requirement
	if (user.reputation < minReputation) {
		return (
			<div>
				Insufficient reputation. Need {minReputation}, have {user.reputation}
			</div>
		);
	}

	// Check single role
	if (requiredRole && user.role !== requiredRole) {
		return <>{fallback}</>;
	}

	// Check multiple roles
	if (requiredRoles && !requiredRoles.includes(user.role)) {
		return <>{fallback}</>;
	}

	return <>{children}</>;
}

// Usage examples:
// <AuthGuard requiredRole="admin">Admin content</AuthGuard>
// <AuthGuard requiredRoles={["admin", "moderator"]}>Mod content</AuthGuard>
// <AuthGuard requireActive minReputation={100}>High rep content</AuthGuard>
