"use client";

import type React from "react";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Github, Mail, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SignIn() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleCredentialsSignIn = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const result = await signIn("credentials", {
				email,
				password,
				redirect: false,
			});

			if (result?.error) {
				setError(result.error);
			} else {
				router.push("/dashboard");
			}
		} catch (error) {
			setError("An unexpected error occurred");
		} finally {
			setLoading(false);
		}
	};

	const handleOAuthSignIn = (provider: string) => {
		signIn(provider, { callbackUrl: "/dashboard" });
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold text-center">
						Welcome back
					</CardTitle>
					<CardDescription className="text-center">
						Sign in to your account to continue
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* OAuth Providers */}
					<div className="grid grid-cols-2 gap-4">
						<Button
							variant="outline"
							onClick={() => handleOAuthSignIn("google")}
							className="w-full"
						>
							<Mail className="mr-2 h-4 w-4" />
							Google
						</Button>
						<Button
							variant="outline"
							onClick={() => handleOAuthSignIn("github")}
							className="w-full"
						>
							<Github className="mr-2 h-4 w-4" />
							GitHub
						</Button>
					</div>

					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<Separator className="w-full" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-background px-2 text-muted-foreground">
								Or continue with
							</span>
						</div>
					</div>

					{/* Credentials Form */}
					<form onSubmit={handleCredentialsSignIn} className="space-y-4">
						{error && (
							<Alert variant="destructive">
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="Enter your email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								placeholder="Enter your password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>

						<Button type="submit" className="w-full" disabled={loading}>
							{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							{loading ? "Signing in..." : "Sign in"}
						</Button>
					</form>

					<div className="text-center text-sm">
						<span className="text-muted-foreground">
							Don't have an account?{" "}
						</span>
						<Button
							variant="link"
							className="p-0 h-auto font-normal"
							onClick={() => router.push("/auth/signup")}
						>
							Sign up
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
