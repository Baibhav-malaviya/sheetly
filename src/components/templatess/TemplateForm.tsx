"use client";

import type React from "react";

import { useState } from "react";
import { createTemplate } from "@/lib/api/templates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, User, Tag, BarChart3 } from "lucide-react";

interface Props {
	selectedIds: string[];
}

export default function TemplateForm({ selectedIds }: Props) {
	const [form, setForm] = useState({
		name: "",
		author: "",
		category: "DSA",
		difficulty: "Medium",
		isOfficial: true,
	});
	const [isLoading, setIsLoading] = useState(false);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSelectChange = (name: string, value: string) => {
		setForm({ ...form, [name]: value });
	};

	const handleSubmit = async () => {
		setIsLoading(true);
		const template = {
			...form,
			problems: selectedIds.map((id, idx) => ({
				problemId: id,
				order: idx + 1,
				isRequired: true,
			})),
		};

		try {
			const res = await createTemplate(template);
			if (res.success) {
				alert("Template created successfully!");
				// Reset form
				setForm({
					name: "",
					author: "",
					category: "DSA",
					difficulty: "Medium",
					isOfficial: true,
				});
			} else {
				alert("Failed to create template");
			}
		} catch (error) {
			alert("An error occurred while creating the template");
		} finally {
			setIsLoading(false);
		}
	};

	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty) {
			case "Easy":
				return "bg-green-100 text-green-800 border-green-200";
			case "Medium":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			case "Hard":
				return "bg-red-100 text-red-800 border-red-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	return (
		<Card className="w-full max-w-2xl mx-auto">
			<CardHeader className="space-y-1">
				<CardTitle className="text-2xl font-bold flex items-center gap-2">
					<FileText className="h-6 w-6 text-primary" />
					Create Template
				</CardTitle>
				<CardDescription>
					Create a new problem template with {selectedIds.length} selected
					problems
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Selected Problems Info */}
				<div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
					<div className="flex items-center gap-2">
						<Tag className="h-4 w-4 text-muted-foreground" />
						<span className="text-sm font-medium">Selected Problems</span>
					</div>
					<Badge variant="secondary" className="font-semibold">
						{selectedIds.length} problems
					</Badge>
				</div>

				{/* Form Fields */}
				<div className="grid gap-4">
					<div className="space-y-2">
						<Label
							htmlFor="name"
							className="text-sm font-medium flex items-center gap-2"
						>
							<FileText className="h-4 w-4" />
							Template Name
						</Label>
						<Input
							id="name"
							name="name"
							placeholder="Enter template name..."
							value={form.name}
							onChange={handleChange}
							className="w-full"
						/>
					</div>

					<div className="space-y-2">
						<Label
							htmlFor="author"
							className="text-sm font-medium flex items-center gap-2"
						>
							<User className="h-4 w-4" />
							Author
						</Label>
						<Input
							id="author"
							name="author"
							placeholder="Enter author name..."
							value={form.author}
							onChange={handleChange}
							className="w-full"
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label className="text-sm font-medium flex items-center gap-2">
								<Tag className="h-4 w-4" />
								Category
							</Label>
							<Select
								value={form.category}
								onValueChange={(value) => handleSelectChange("category", value)}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select category" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="DSA">
										Data Structures & Algorithms
									</SelectItem>
									<SelectItem value="System Design">System Design</SelectItem>
									<SelectItem value="Frontend">Frontend</SelectItem>
									<SelectItem value="Backend">Backend</SelectItem>
									<SelectItem value="Database">Database</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label className="text-sm font-medium flex items-center gap-2">
								<BarChart3 className="h-4 w-4" />
								Difficulty
							</Label>
							<Select
								value={form.difficulty}
								onValueChange={(value) =>
									handleSelectChange("difficulty", value)
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select difficulty" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Easy">
										<div className="flex items-center gap-2">
											<div className="w-2 h-2 rounded-full bg-green-500"></div>
											Easy
										</div>
									</SelectItem>
									<SelectItem value="Medium">
										<div className="flex items-center gap-2">
											<div className="w-2 h-2 rounded-full bg-yellow-500"></div>
											Medium
										</div>
									</SelectItem>
									<SelectItem value="Hard">
										<div className="flex items-center gap-2">
											<div className="w-2 h-2 rounded-full bg-red-500"></div>
											Hard
										</div>
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>

				{/* Template Preview */}
				<div className="p-4 bg-muted/30 rounded-lg border-2 border-dashed">
					<h4 className="font-medium text-sm text-muted-foreground mb-3">
						Template Preview
					</h4>
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<span className="text-sm">Name:</span>
							<span className="text-sm font-medium">
								{form.name || "Untitled Template"}
							</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm">Author:</span>
							<span className="text-sm font-medium">
								{form.author || "Anonymous"}
							</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm">Category:</span>
							<Badge variant="outline">{form.category}</Badge>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm">Difficulty:</span>
							<Badge className={getDifficultyColor(form.difficulty)}>
								{form.difficulty}
							</Badge>
						</div>
					</div>
				</div>

				{/* Submit Button */}
				<Button
					onClick={handleSubmit}
					disabled={
						selectedIds.length === 0 ||
						!form.name.trim() ||
						!form.author.trim() ||
						isLoading
					}
					className="w-full h-11 text-base font-medium"
					size="lg"
				>
					{isLoading ? (
						<>
							<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
							Creating Template...
						</>
					) : (
						<>
							<FileText className="w-4 h-4 mr-2" />
							Create Template
						</>
					)}
				</Button>

				{selectedIds.length === 0 && (
					<p className="text-sm text-muted-foreground text-center">
						Please select at least one problem to create a template
					</p>
				)}
			</CardContent>
		</Card>
	);
}
