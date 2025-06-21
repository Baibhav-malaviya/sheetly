"use client";

import type React from "react";
import { useSheets } from "@/hooks/useSheets";
import type { UpdateSheetData } from "@/lib/api/sheets";
import type { ISheetDocument as ISheet } from "@/types/sheet.type";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Search,
	MoreVertical,
	Edit,
	Trash2,
	Copy,
	Eye,
	ThumbsUp,
	Star,
	Tag,
	Calendar,
	Globe,
	Lock,
} from "lucide-react";

import PopUpModal from "../PopUpModal";
import SheetEditForm from "./SheetEditForm";
import { useState } from "react";
import { toast } from "sonner";

interface SheetListProps {
	sheets: ISheet[];
}

const SheetList: React.FC<SheetListProps> = ({ sheets }) => {
	const { editSheet, removeSheet, copySheet } = useSheets();
	const [editingSheet, setEditingSheet] = useState<ISheet | null>(null);

	const handleEditSheet = (sheet: ISheet) => {
		setEditingSheet(sheet);
	};

	const handleSaveSheet = async (updates: UpdateSheetData) => {
		if (!editingSheet) return;

		try {
			const updated = await editSheet(editingSheet._id.toString(), updates);
			toast.success("Sheet updated", {
				description: `Successfully updated "${updated.name}"`,
			});
			setEditingSheet(null);
		} catch (err: any) {
			toast.error("Error", {
				description: `Failed to update sheet: ${
					err.message || "Unknown error"
				}`,
			});
			throw err; // Re-throw to prevent modal from closing
		}
	};

	const handleDeleteSheet = async (sheetId: string) => {
		try {
			await removeSheet(sheetId);
			toast.success("Sheet deleted", {
				description: "Sheet has been successfully deleted",
			});
		} catch (err: any) {
			toast.error("Error", {
				description: `Failed to delete sheet: ${
					err.message || "Unknown error"
				}`,
			});
		}
	};

	const handleDuplicateSheet = async (sheetId: string) => {
		try {
			const duplicated = await copySheet(sheetId);
			toast.success("Sheet duplicated", {
				description: `Successfully created "${duplicated.name}"`,
			});
		} catch (err: any) {
			toast.error("Error", {
				description: `Failed to duplicate sheet: ${
					err.message || "Unknown error"
				}`,
			});
		}
	};

	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty?.toLowerCase()) {
			case "easy":
				return "bg-green-100 text-green-800 border-green-200";
			case "medium":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			case "hard":
				return "bg-red-100 text-red-800 border-red-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	const getCategoryColor = (category: string) => {
		const colors = [
			"bg-blue-100 text-blue-800 border-blue-200",
			"bg-purple-100 text-purple-800 border-purple-200",
			"bg-indigo-100 text-indigo-800 border-indigo-200",
			"bg-pink-100 text-pink-800 border-pink-200",
			"bg-cyan-100 text-cyan-800 border-cyan-200",
		];
		const hash =
			category?.split("").reduce((a, b) => a + b.charCodeAt(0), 0) || 0;
		return colors[hash % colors.length];
	};

	if (sheets.length === 0) {
		return (
			<Card className="text-center py-12">
				<CardContent>
					<Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
					<h3 className="text-lg font-medium mb-2">No Sheets Found</h3>
					<p className="text-muted-foreground mb-4">
						No sheets match your current search criteria or filters.
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{sheets.map((sheet: ISheet) => (
				<Card
					key={sheet._id.toString()}
					className="h-full hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group"
				>
					<CardHeader className="pb-3">
						<div className="flex items-start justify-between mb-2">
							<CardTitle className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
								{sheet.name}
							</CardTitle>
							<div className="flex items-center gap-2">
								{sheet.isPublic ? (
									<Globe className="h-4 w-4 text-green-600" />
								) : (
									<Lock className="h-4 w-4 text-muted-foreground" />
								)}
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
											<MoreVertical className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem onClick={() => handleEditSheet(sheet)}>
											<Edit className="h-4 w-4 mr-2" />
											Edit
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() => handleDuplicateSheet(sheet._id.toString())}
										>
											<Copy className="h-4 w-4 mr-2" />
											Duplicate
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<AlertDialog>
											<AlertDialogTrigger asChild>
												<DropdownMenuItem
													onSelect={(e) => e.preventDefault()}
													className="text-red-600 focus:text-red-600"
												>
													<Trash2 className="h-4 w-4 mr-2" />
													Delete
												</DropdownMenuItem>
											</AlertDialogTrigger>
											<AlertDialogContent>
												<AlertDialogHeader>
													<AlertDialogTitle>Delete Sheet</AlertDialogTitle>
													<AlertDialogDescription>
														Are you sure you want to delete "{sheet.name}"? This
														action cannot be undone.
													</AlertDialogDescription>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogCancel>Cancel</AlertDialogCancel>
													<AlertDialogAction
														onClick={() =>
															handleDeleteSheet(sheet._id.toString())
														}
														className="bg-red-600 hover:bg-red-700"
													>
														Delete
													</AlertDialogAction>
												</AlertDialogFooter>
											</AlertDialogContent>
										</AlertDialog>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</div>
						<CardDescription className="line-clamp-2">
							{sheet.description || "No description provided"}
						</CardDescription>
					</CardHeader>

					<CardContent className="space-y-4">
						{/* Category and Difficulty */}
						<div className="flex items-center gap-2">
							<Badge
								className={getDifficultyColor(sheet.difficulty)}
								variant="outline"
							>
								{sheet.difficulty}
							</Badge>
							<Badge
								className={getCategoryColor(sheet.category)}
								variant="outline"
							>
								{sheet.category}
							</Badge>
						</div>

						{/* Tags */}
						{sheet.tags && sheet.tags.length > 0 && (
							<div className="flex flex-wrap gap-1">
								{sheet.tags.slice(0, 3).map((tag) => (
									<Badge key={tag} variant="secondary">
										<Tag className="h-3 w-3 mr-1" />
										{tag}
									</Badge>
								))}
								{sheet.tags.length > 3 && (
									<Badge variant="secondary">+{sheet.tags.length - 3}</Badge>
								)}
							</div>
						)}

						{/* Social Stats */}
						<div className="grid grid-cols-2 gap-4 text-sm">
							<div className="flex items-center gap-2">
								<ThumbsUp className="h-4 w-4 text-green-600" />
								<span className="text-muted-foreground">Likes:</span>
								<span className="font-medium">
									{sheet.social?.upvotes || 0}
								</span>
							</div>
							<div className="flex items-center gap-2">
								<Eye className="h-4 w-4 text-blue-600" />
								<span className="text-muted-foreground">Views:</span>
								<span className="font-medium">{sheet.social?.views || 0}</span>
							</div>
							<div className="flex items-center gap-2">
								<Star className="h-4 w-4 text-yellow-600" />
								<span className="text-muted-foreground">Score:</span>
								<span className="font-medium">{sheet.social?.score || 0}</span>
							</div>
							<div className="flex items-center gap-2">
								<Calendar className="h-4 w-4 text-muted-foreground" />
								<span className="text-muted-foreground">Created:</span>
								<span className="font-medium">
									{sheet.createdAt
										? new Date(sheet.createdAt).toLocaleDateString()
										: "N/A"}
								</span>
							</div>
						</div>
					</CardContent>
				</Card>
			))}
			{/* Edit Modal */}
			<PopUpModal
				isOpen={!!editingSheet}
				onClose={() => setEditingSheet(null)}
				title="Edit Sheet"
				description="Update your sheet information and settings"
				onSave={() => {}} // This will be handled by the form
				maxWidth="lg"
			>
				{editingSheet && (
					<SheetEditForm sheet={editingSheet} onSubmit={handleSaveSheet} />
				)}
			</PopUpModal>
		</div>
	);
};

export default SheetList;
