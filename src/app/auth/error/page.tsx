"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AuthErrorPage() {
	const searchParams = useSearchParams();
	const error = searchParams.get("error");

	// You can map known error messages to friendlier ones here
	const friendlyMessage =
		{
			"No user found with this email":
				"No account was found with that email. Please check or sign up.",
			"Invalid password":
				"The password you entered is incorrect. Please try again.",
			"Email and password are required":
				"Please fill in both email and password fields.",
		}[error || ""] || "Something went wrong during sign in. Please try again.";

	return (
		<div className="min-h-screen flex items-center justify-center bg-background px-4">
			<div className="max-w-md w-full p-6 rounded-2xl shadow-md border bg-card text-card-foreground space-y-4">
				<h1 className="text-2xl font-bold text-center">Authentication Error</h1>
				<p className="text-sm text-muted-foreground text-center">
					{friendlyMessage}
				</p>

				<div className="flex flex-col gap-2 pt-4">
					<Link
						href="/auth/signin"
						className="text-primary text-center underline"
					>
						Try Signing In Again
					</Link>
					<Link
						href="/auth/signup"
						className="text-sm text-muted-foreground text-center"
					>
						Don&apos;t have an account? Sign Up
					</Link>
				</div>
			</div>
		</div>
	);
}
