"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	AlertCircle,
	ArrowLeft,
	Home,
	RefreshCw,
	Wifi,
	FileX,
	ShieldAlert,
	Server,
	type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

export interface ErrorAction {
	label: string;
	onClick: () => void;
	variant?:
		| "default"
		| "outline"
		| "secondary"
		| "destructive"
		| "ghost"
		| "link";
	icon?: LucideIcon;
}

export interface ErrorStateProps {
	title?: string;
	message?: string;
	type?: "404" | "500" | "network" | "unauthorized" | "forbidden" | "generic";
	icon?: LucideIcon;
	actions?: ErrorAction[];
	showDefaultActions?: boolean;
	className?: string;
}

const errorConfigs = {
	"404": {
		title: "Page Not Found",
		message: "The page you're looking for doesn't exist or has been moved.",
		icon: FileX,
	},
	"500": {
		title: "Server Error",
		message: "Something went wrong on our end. Please try again later.",
		icon: Server,
	},
	network: {
		title: "Connection Error",
		message:
			"Unable to connect to the server. Please check your internet connection.",
		icon: Wifi,
	},
	unauthorized: {
		title: "Access Denied",
		message: "You don't have permission to access this resource.",
		icon: ShieldAlert,
	},
	forbidden: {
		title: "Forbidden",
		message: "You don't have permission to perform this action.",
		icon: ShieldAlert,
	},
	generic: {
		title: "Something went wrong",
		message: "An unexpected error occurred. Please try again.",
		icon: AlertCircle,
	},
};

export default function ErrorState({
	title,
	message,
	type = "generic",
	icon,
	actions,
	showDefaultActions = true,
	className = "",
}: ErrorStateProps) {
	const router = useRouter();

	const config = errorConfigs[type];
	const finalTitle = title || config.title;
	const finalMessage = message || config.message;
	const IconComponent = icon || config.icon;

	const defaultActions: ErrorAction[] = [
		{
			label: "Go Back",
			onClick: () => router.back(),
			variant: "outline",
			icon: ArrowLeft,
		},
		{
			label: "Go Home",
			onClick: () => router.push("/"),
			variant: "default",
			icon: Home,
		},
	];

	// Add retry action for certain error types
	if (type === "network" || type === "500") {
		defaultActions.unshift({
			label: "Try Again",
			onClick: () => window.location.reload(),
			variant: "default",
			icon: RefreshCw,
		});
	}

	const finalActions = actions || (showDefaultActions ? defaultActions : []);

	return (
		<div
			className={`min-h-screen bg-gradient-to-br from-background to-muted/20 ${className}`}
		>
			<div className="container mx-auto px-4 py-8 max-w-2xl">
				<Card className="text-center py-12">
					<CardContent className="space-y-6">
						<div className="flex justify-center">
							<div className="p-4 bg-muted/50 rounded-full">
								<IconComponent className="h-12 w-12 text-muted-foreground" />
							</div>
						</div>

						<div className="space-y-2">
							<h2 className="text-2xl font-semibold">{finalTitle}</h2>
							<p className="text-muted-foreground max-w-md mx-auto">
								{finalMessage}
							</p>
						</div>

						{finalActions.length > 0 && (
							<div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
								{finalActions.map((action, index) => {
									const ActionIcon = action.icon;
									return (
										<Button
											key={index}
											onClick={action.onClick}
											variant={action.variant || "default"}
											className="gap-2"
										>
											{ActionIcon && <ActionIcon className="h-4 w-4" />}
											{action.label}
										</Button>
									);
								})}
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

// Specialized error components for common use cases
export function NotFoundError({
	title = "Template Not Found",
	message = "The template you're looking for doesn't exist or has been removed.",
	...props
}: Omit<ErrorStateProps, "type">) {
	return <ErrorState type="404" title={title} message={message} {...props} />;
}

export function ServerError({
	title = "Server Error",
	message = "Something went wrong on our end. Please try again later.",
	...props
}: Omit<ErrorStateProps, "type">) {
	return <ErrorState type="500" title={title} message={message} {...props} />;
}

export function NetworkError({
	title = "Connection Error",
	message = "Unable to connect to the server. Please check your internet connection.",
	...props
}: Omit<ErrorStateProps, "type">) {
	return (
		<ErrorState type="network" title={title} message={message} {...props} />
	);
}

export function UnauthorizedError({
	title = "Access Denied",
	message = "You need to sign in to access this resource.",
	...props
}: Omit<ErrorStateProps, "type">) {
	return (
		<ErrorState
			type="unauthorized"
			title={title}
			message={message}
			{...props}
		/>
	);
}
