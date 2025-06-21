"use client";
import { ObjectId } from "mongoose";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Tag, BarChart3 } from "lucide-react";
import { createSheet } from "@/lib/api/sheets";
import {
	ISheetProblem,
	SheetCategory, // Import SheetCategory
	SheetDifficulty, // Import SheetDifficulty
} from "@/types/sheet.type"; // Ensure these are imported from your types file

interface Props {
	selectedProblemIds: string[];
}

export default function SheetForm({ selectedProblemIds }: Props) {
	const [form, setForm] = useState({
		name: "",
		description: "",
		isTemplate: false,
		isPublic: true,
		category: "Personal" as SheetCategory, // Explicitly cast to SheetCategory
		difficulty: "Medium" as SheetDifficulty, // Explicitly cast to SheetDifficulty
	});

	const [isLoading, setIsLoading] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	// Corrected type for the name parameter
	const handleSelectChange = (name: keyof typeof form, value: string) => {
		setForm({ ...form, [name]: value });
	};

	const handleSubmit = async () => {
		setIsLoading(true);
		const selectedProblems = selectedProblemIds.map((id, idx) => ({
			problemId: id, // `id` is already a string, which is correct for sending to API
			order: idx + 1,
			addedAt: new Date(),

			status: "Not Started", // This should match a valid ProblemStatus enum if you have one
			completed: false,
			timeSpent: 0,
			attempts: 0,
			approaches: [],
			bookmarked: false,
		}));
		const sheet = {
			...form,
			problems: selectedProblems as ISheetProblem[],
		};

		try {
			// The createSheet function from your API file expects `CreateSheetData`.
			// The `sheet` object created above now correctly aligns with `CreateSheetData`
			// assuming `ISheetProblem.problemId` can be a string.
			const res = await createSheet(sheet);
			if (res) {
				// Assuming createSheet returns the created sheet document, check for its existence
				alert("Sheet created successfully");
				// Reset form
				setForm({
					name: "",
					isTemplate: false,
					description: "",
					isPublic: true,
					category: "Personal" as SheetCategory,
					difficulty: "Medium" as SheetDifficulty,
				});
			} else {
				alert("Failed to create sheet");
			}
		} catch (err) {
			console.error("Error creating sheet:", err);
			alert("Error occurred while creating sheet");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card className="w-full max-w-2xl mx-auto">
			<CardHeader>
				<CardTitle className="text-2xl font-bold flex items-center gap-2">
					<FileText className="h-6 w-6 text-primary" /> Create Sheet
				</CardTitle>
				<CardDescription>
					Create a personalized sheet with {selectedProblemIds.length} problems.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="grid gap-4">
					<div className="space-y-2">
						<Label htmlFor="name">Sheet Name</Label>
						<Input
							id="name"
							name="name"
							placeholder="Enter sheet name..."
							value={form.name}
							onChange={handleChange}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Input
							id="description"
							name="description"
							placeholder="Short description..."
							value={form.description}
							onChange={handleChange}
						/>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>Category</Label>
							<Select
								value={form.category}
								onValueChange={(value) =>
									handleSelectChange("category", value as SheetCategory)
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select category" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Personal">Personal</SelectItem>
									<SelectItem value="Study">Study</SelectItem>
									<SelectItem value="Template">Template</SelectItem>
									<SelectItem value="Other">Other</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label>Difficulty</Label>
							<Select
								value={form.difficulty}
								onValueChange={(value) =>
									handleSelectChange("difficulty", value as SheetDifficulty)
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select difficulty" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Easy">Easy</SelectItem>
									<SelectItem value="Medium">Medium</SelectItem>
									<SelectItem value="Hard">Hard</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>

				<Button
					onClick={handleSubmit}
					disabled={
						selectedProblemIds.length === 0 || !form.name.trim() || isLoading
					}
					className="w-full"
				>
					{isLoading ? "Creating Sheet..." : "Create Sheet"}
				</Button>
			</CardContent>
		</Card>
	);
}
