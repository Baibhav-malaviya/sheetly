// hooks/useAuth.ts
import { useSession } from "next-auth/react";
import { Session } from "next-auth";

type UserRole = "user" | "admin" | "moderator";

interface UseAuthReturn {
	session: Session | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	user: Session["user"] | undefined;
	hasRole: (role: UserRole) => boolean;
	hasAnyRole: (roles: UserRole[]) => boolean;
	isAdmin: boolean;
	isModerator: boolean;
	isActive: boolean;
	reputation: number;
}

export function useAuth(): UseAuthReturn {
	const { data: session, status } = useSession();

	const isAuthenticated = !!session;
	const isLoading = status === "loading";
	const user = session?.user;

	const hasRole = (role: UserRole): boolean => {
		return user?.role === role;
	};

	const hasAnyRole = (roles: UserRole[]): boolean => {
		return user?.role ? roles.includes(user.role) : false;
	};

	const isAdmin = hasRole("admin");
	const isModerator = hasRole("moderator");
	const isActive = user?.isActive ?? false;
	const reputation = user?.reputation ?? 0;

	return {
		session,
		isAuthenticated,
		isLoading,
		user,
		hasRole,
		hasAnyRole,
		isAdmin,
		isModerator,
		isActive,
		reputation,
	};
}
