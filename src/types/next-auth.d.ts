// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			email: string;
			username?: string;
			role: "user" | "admin" | "moderator";
			isActive: boolean;
			reputation: number;
			profile: {
				name?: string;
				avatar?: string;
				timezone?: string;
				preferences?: {
					defaultView?: string;
					notifications?: boolean;
					theme?: string;
				};
			};
			lastLogin?: Date;
			emailVerified?: Date | null;
		} & DefaultSession["user"];
	}

	interface User {
		id: string;
		email: string;
		username?: string;
		emailVerified?: Date | null;
		role: "user" | "admin" | "moderator";
		isActive: boolean;
		reputation: number;
		profile: {
			name?: string;
			avatar?: string;
			timezone?: string;
			preferences?: {
				defaultView?: string;
				notifications?: boolean;
				theme?: string;
			};
		};
		socialSettings: Record<string, any>;
		publicProfile: Record<string, any>;
		lastLogin?: Date;
		createdAt: Date;
		updatedAt: Date;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id: string;
		email: string;
		username?: string;
		role: "user" | "admin" | "moderator";
		isActive: boolean;
		reputation: number;
		profile: {
			name?: string;
			avatar?: string;
			timezone?: string;
			preferences?: {
				defaultView?: string;
				notifications?: boolean;
				theme?: string;
			};
		};
		lastLogin?: Date;
		emailVerified?: Date | null;
	}
}
