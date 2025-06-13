"use client";

import { useSheets } from "@/hooks/useSheets";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	Plus,
	Copy,
	Trash2,
	FileText,
	Globe,
	Lock,
	MoreVertical,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SheetsList() {
	const { sheets, loading, error, addSheet, removeSheet, copySheet } =
		useSheets();

	const handleCreateSheet = async () => {
		try {
			await addSheet({
				title: "New Sheet",
				content: "",
				isPublic: false,
			});
		} catch (err) {
			console.error("Failed to create sheet:", err);
		}
	};

	const handleDeleteSheet = async (id: string) => {
		if (confirm("Are you sure you want to delete this sheet?")) {
			try {
				await removeSheet(id);
			} catch (err) {
				console.error("Failed to delete sheet:", err);
			}
		}
	};

	const handleDuplicateSheet = async (id: string) => {
		try {
			await copySheet(id);
		} catch (err) {
			console.error("Failed to duplicate sheet:", err);
		}
	};

	if (loading) {
		return (
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<div>
						<Skeleton className="h-8 w-32" />
						<Skeleton className="h-4 w-48 mt-2" />
					</div>
					<Skeleton className="h-10 w-32" />
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{Array.from({ length: 6 }).map((_, i) => (
						<Card key={i} className="h-48">
							<CardHeader>
								<Skeleton className="h-6 w-3/4" />
								<Skeleton className="h-4 w-full" />
							</CardHeader>
							<CardContent>
								<Skeleton className="h-4 w-1/2" />
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<Alert variant="destructive">
				<AlertDescription>Error loading sheets: {error}</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">My Sheets</h1>
					<p className="text-muted-foreground">
						Manage and organize your spreadsheets
					</p>
				</div>
				<Button onClick={handleCreateSheet} className="gap-2">
					<Plus className="h-4 w-4" />
					Create New Sheet
				</Button>
			</div>

			{/* Empty State */}
			{sheets.length === 0 ? (
				<Card className="flex flex-col items-center justify-center py-16 text-center">
					<FileText className="h-12 w-12 text-muted-foreground mb-4" />
					<h3 className="text-lg font-semibold mb-2">No sheets yet</h3>
					<p className="text-muted-foreground mb-4 max-w-sm">
						Get started by creating your first spreadsheet. You can organize
						data, create formulas, and share with others.
					</p>
					<Button onClick={handleCreateSheet} className="gap-2">
						<Plus className="h-4 w-4" />
						Create Your First Sheet
					</Button>
				</Card>
			) : (
				/* Sheets Grid */
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{sheets.map((sheet) => (
						<Card
							key={sheet._id}
							className="group hover:shadow-md transition-shadow duration-200"
						>
							<CardHeader className="pb-3">
								<div className="flex items-start justify-between">
									<div className="flex-1 min-w-0">
										<CardTitle className="text-lg truncate">
											{sheet.title}
										</CardTitle>
										{sheet.description && (
											<CardDescription className="mt-1 line-clamp-2">
												{sheet.description}
											</CardDescription>
										)}
									</div>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="ghost"
												size="sm"
												className="opacity-0 group-hover:opacity-100 transition-opacity"
											>
												<MoreVertical className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem
												onClick={() => handleDuplicateSheet(sheet._id)}
											>
												<Copy className="h-4 w-4 mr-2" />
												Duplicate
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => handleDeleteSheet(sheet._id)}
												className="text-destructive focus:text-destructive"
											>
												<Trash2 className="h-4 w-4 mr-2" />
												Delete
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</CardHeader>

							<CardContent className="pt-0">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										{sheet.isPublic ? (
											<Badge variant="secondary" className="gap-1">
												<Globe className="h-3 w-3" />
												Public
											</Badge>
										) : (
											<Badge variant="outline" className="gap-1">
												<Lock className="h-3 w-3" />
												Private
											</Badge>
										)}
									</div>

									<div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleDuplicateSheet(sheet._id)}
											className="h-8 w-8 p-0"
										>
											<Copy className="h-3 w-3" />
										</Button>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleDeleteSheet(sheet._id)}
											className="h-8 w-8 p-0 text-destructive hover:text-destructive"
										>
											<Trash2 className="h-3 w-3" />
										</Button>
									</div>
								</div>

								{/* Optional: Add last modified date */}
								<div className="mt-3 text-xs text-muted-foreground">
									Last modified: {new Date().toLocaleDateString()}
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
