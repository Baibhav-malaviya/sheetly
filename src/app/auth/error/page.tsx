"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
	AlertCircle,
	ArrowLeft,
	Mail,
	Lock,
	UserX,
	Wifi,
	Shield,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AuthErrorPage() {
	const searchParams = useSearchParams();
	const error = searchParams.get("error");

	// Enhanced error mapping with more comprehensive coverage
	const getErrorDetails = (errorCode: string | null) => {
		const errorMap: Record<
			string,
			{ message: string; icon: any; suggestion: string }
		> = {
			// Common authentication errors
			"No user found with this email": {
				message: "We couldn't find an account with that email address.",
				icon: UserX,
				suggestion:
					"Double-check your email or create a new account if you're new here.",
			},
			"Invalid password": {
				message: "The password you entered is incorrect.",
				icon: Lock,
				suggestion:
					"Please try again or reset your password if you've forgotten it.",
			},
			"Email and password are required": {
				message: "Please fill in both your email and password.",
				icon: Mail,
				suggestion: "Both fields are required to sign in to your account.",
			},
			"Invalid credentials": {
				message: "The email or password you entered is incorrect.",
				icon: Shield,
				suggestion: "Please check your credentials and try again.",
			},
			"Account not verified": {
				message: "Your account hasn't been verified yet.",
				icon: Mail,
				suggestion:
					"Please check your email and click the verification link we sent you.",
			},
			"Account locked": {
				message: "Your account has been temporarily locked.",
				icon: Lock,
				suggestion:
					"This is usually due to multiple failed login attempts. Please try again later or contact support.",
			},
			"Session expired": {
				message: "Your session has expired for security reasons.",
				icon: Shield,
				suggestion: "Please sign in again to continue.",
			},
			"Network error": {
				message: "We're having trouble connecting to our servers.",
				icon: Wifi,
				suggestion: "Please check your internet connection and try again.",
			},
			"Too many requests": {
				message: "Too many sign-in attempts detected.",
				icon: Shield,
				suggestion: "Please wait a few minutes before trying again.",
			},
			"Email already exists": {
				message: "An account with this email already exists.",
				icon: Mail,
				suggestion: "Try signing in instead, or use a different email address.",
			},
		};

		return (
			errorMap[errorCode || ""] || {
				message: "Something unexpected happened during sign in.",
				icon: AlertCircle,
				suggestion:
					"Please try again, or contact support if the problem persists.",
			}
		);
	};

	const errorDetails = getErrorDetails(error);
	const IconComponent = errorDetails.icon;

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 px-4 py-8">
			<div className="w-full max-w-md">
				<Card className="shadow-lg border-0 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
					<CardHeader className="text-center pb-4">
						<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
							<IconComponent className="h-6 w-6 text-destructive" />
						</div>
						<h1 className="text-2xl font-semibold tracking-tight">
							Authentication Failed
						</h1>
						<p className="text-sm text-muted-foreground">
							We encountered an issue while signing you in
						</p>
					</CardHeader>

					<CardContent className="space-y-6">
						<Alert className="border-destructive/20 bg-destructive/5">
							<AlertCircle className="h-4 w-4 text-destructive" />
							<AlertDescription className="text-sm">
								<span className="font-medium block mb-1">
									{errorDetails.message}
								</span>
								<span className="text-muted-foreground">
									{errorDetails.suggestion}
								</span>
							</AlertDescription>
						</Alert>

						<div className="space-y-3">
							<Button asChild className="w-full" size="lg">
								<Link href="/auth/signin">
									<ArrowLeft className="mr-2 h-4 w-4" />
									Try Signing In Again
								</Link>
							</Button>

							<div className="flex flex-col sm:flex-row gap-2">
								<Button asChild variant="outline" className="flex-1" size="sm">
									<Link href="/auth/forgot-password">Reset Password</Link>
								</Button>
								<Button asChild variant="outline" className="flex-1" size="sm">
									<Link href="/auth/signup">Create Account</Link>
								</Button>
							</div>
						</div>

						<div className="text-center pt-4 border-t">
							<p className="text-xs text-muted-foreground mb-2">
								Still having trouble?
							</p>
							<Link
								href="/support"
								className="text-xs text-primary hover:underline font-medium"
							>
								Contact Support
							</Link>
						</div>
					</CardContent>
				</Card>

				{/* Debug info for development */}
				{process.env.NODE_ENV === "development" && error && (
					<Card className="mt-4 border-orange-200 bg-orange-50/50">
						<CardContent className="pt-4">
							<p className="text-xs text-orange-800 font-mono">
								Debug: {error}
							</p>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}
