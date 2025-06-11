import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default withAuth(
	function middleware(req: NextRequest) {
		const { pathname } = req.nextUrl;
		const token = (req as any).nextauth.token;

		// Redirect non-admin users from admin routes
		if (pathname.startsWith("/admin") && token?.role !== "admin") {
			return NextResponse.redirect(new URL("/unauthorized", req.url));
		}

		// Redirect unauthenticated users from dashboard
		if (pathname.startsWith("/dashboard") && !token) {
			const signInUrl = new URL("/auth/signin", req.url);
			signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
			return NextResponse.redirect(signInUrl);
		}

		// Redirect logged-in users away from auth pages
		if (
			pathname.startsWith("/auth/signin") ||
			pathname.startsWith("/auth/signup")
		) {
			if (token) {
				return NextResponse.redirect(new URL("/dashboard", req.url));
			}
		}

		return NextResponse.next();
	},
	{
		callbacks: {
			authorized: ({ token, req }) => {
				const { pathname } = req.nextUrl;

				// Always allow static assets and auth routes
				if (
					pathname.startsWith("/api/auth") ||
					pathname === "/" ||
					pathname.startsWith("/_next") ||
					pathname.startsWith("/favicon.ico") ||
					pathname.startsWith("/public")
				) {
					return true;
				}

				// Protected routes
				if (
					pathname.startsWith("/dashboard") ||
					pathname.startsWith("/admin") ||
					pathname.startsWith("/profile")
				) {
					return !!token;
				}

				// Allow access to auth routes if not logged in
				if (pathname.startsWith("/auth")) {
					return true;
				}

				// Default: require authentication
				return !!token;
			},
		},
	}
);

// Only run middleware on these paths
export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
