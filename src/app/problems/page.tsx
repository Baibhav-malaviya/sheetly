"use client";

import { useState } from "react";
import { useProblem } from "@/hooks/useProblem";
import type { IProblem as Problem } from "@/types/problem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import ProblemRow from "./ProblemRow";

// Helper to get initial form data structure
const getInitialFormData = (): Partial<Problem> => ({
	title: "",
	slug: "",
	description: "",
	difficulty: "Easy",
	category: "",
	tags: [],
	companies: [],
	platformLinks: {
		leetcode: "",
		gfg: "",
		hackerrank: "",
		codeforces: "",
		custom: "",
	},
	editorial: "",
	hints: [],
	constraints: "",
	examples: [],
	isActive: true,
});

export default function ProblemsPage() {
	const { problems, create, update, remove, loading, error } = useProblem();

	const [formData, setFormData] = useState<Partial<Problem>>(
		getInitialFormData()
	);
	const [editId, setEditId] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// State for temporary inputs for array fields
	const [tagInput, setTagInput] = useState("");
	const [companyInput, setCompanyInput] = useState("");

	// --- Event Handlers ---

	// Handle simple text input/textarea change
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	// Handle platform link changes
	const handlePlatformLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			platformLinks: { ...prev.platformLinks, [name]: value },
		}));
	};

	// Handle difficulty select change
	const handleSelectChange = (value: string) => {
		setFormData((prev: any) => ({ ...prev, difficulty: value }));
	};

	// Handle checkbox change
	const handleCheckboxChange = (checked: boolean) => {
		setFormData((prev) => ({ ...prev, isActive: checked }));
	};

	// Generic handler to add item to an array field (tags, companies)
	const handleAddItem = (field: "tags" | "companies", value: string) => {
		if (value.trim() === "") return;
		setFormData((prev) => ({
			...prev,
			[field]: [...(prev[field] || []), value.trim()],
		}));
	};

	// Generic handler to remove item from an array field
	const handleRemoveItem = (
		field: "tags" | "companies" | "hints",
		index: number
	) => {
		setFormData((prev) => ({
			...prev,
			[field]: (prev[field] as string[]).filter((_, i) => i !== index),
		}));
	};

	// Handlers for dynamic hints
	const addHint = () =>
		setFormData((prev) => ({ ...prev, hints: [...(prev.hints || []), ""] }));
	const handleHintChange = (index: number, value: string) => {
		const newHints = [...(formData.hints || [])];
		newHints[index] = value;
		setFormData((prev) => ({ ...prev, hints: newHints }));
	};

	// Handlers for dynamic examples
	const addExample = () =>
		setFormData((prev) => ({
			...prev,
			examples: [
				...(prev.examples || []),
				{ input: "", output: "", explanation: "" },
			],
		}));
	const removeExample = (index: number) =>
		setFormData((prev) => ({
			...prev,
			examples: (prev.examples || []).filter((_, i) => i !== index),
		}));
	const handleExampleChange = (
		index: number,
		field: keyof Problem["examples"][0],
		value: string
	) => {
		const newExamples = [...(formData.examples || [])];
		newExamples[index] = { ...newExamples[index], [field]: value };
		setFormData((prev) => ({ ...prev, examples: newExamples }));
	};

	// --- Form Actions ---

	const handleSubmit = async () => {
		setIsSubmitting(true);
		try {
			if (editId) {
				await update(editId, formData);
				setEditId(null);
			} else {
				await create(formData);
			}
			// Reset form to initial state
			setFormData(getInitialFormData());
			setTagInput("");
			setCompanyInput("");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDelete = async (id: string) => {
		await remove(id);
	};

	const handleEdit = (problem: Problem) => {
		setEditId(problem._id.toString());
		setFormData({
			title: problem.title,
			slug: problem.slug,
			description: problem.description,
			difficulty: problem.difficulty,
			category: problem.category,
			tags: problem.tags || [],
			companies: problem.companies || [],
			platformLinks:
				problem.platformLinks || getInitialFormData().platformLinks,
			editorial: problem.editorial || "",
			hints: problem.hints || [],
			constraints: problem.constraints || "",
			examples: problem.examples || [],
			isActive: typeof problem.isActive === "boolean" ? problem.isActive : true,
		});
		window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to form
	};

	// Helper for difficulty badge color
	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty) {
			case "Easy":
				return "bg-green-100 text-green-800 hover:bg-green-100";
			case "Medium":
				return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
			case "Hard":
				return "bg-red-100 text-red-800 hover:bg-red-100";
			default:
				return "bg-gray-100 text-gray-800 hover:bg-gray-100";
		}
	};

	return (
		<div className="container mx-auto py-8 px-4">
			<div className="grid gap-8 md:grid-cols-[1fr_2fr] max-h-[calc(100vh-8rem)]">
				{/* Form Section */}
				<Card className="flex flex-col max-h-full">
					<CardHeader className="flex-shrink-0">
						<CardTitle>
							{editId ? "Update Problem" : "Add New Problem"}
						</CardTitle>
						<CardDescription>
							{editId
								? "Edit the details of the problem."
								: "Fill out the form to create a new problem."}
						</CardDescription>
					</CardHeader>
					<CardContent className="flex-1 overflow-y-auto min-h-0 space-y-4">
						{/* Basic Info */}
						<div className="space-y-2">
							<Label htmlFor="title">Title</Label>
							<Input
								id="title"
								name="title"
								placeholder="e.g., Two Sum"
								value={formData.title || ""}
								onChange={handleChange}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="slug">Slug</Label>
							<Input
								id="slug"
								name="slug"
								placeholder="e.g., two-sum (auto-generated if blank)"
								value={formData.slug || ""}
								onChange={handleChange}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="description">Description</Label>
							<Textarea
								id="description"
								name="description"
								placeholder="Problem description in detail..."
								value={formData.description || ""}
								onChange={handleChange}
								rows={5}
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="difficulty">Difficulty</Label>
								<Select
									value={formData.difficulty || "Easy"}
									onValueChange={handleSelectChange}
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
							<div className="space-y-2">
								<Label htmlFor="category">Category</Label>
								<Input
									id="category"
									name="category"
									placeholder="e.g., Arrays"
									value={formData.category || ""}
									onChange={handleChange}
								/>
							</div>
						</div>

						{/* Tags */}
						<div className="space-y-2">
							<Label htmlFor="tags">Tags</Label>
							<div className="flex items-center gap-2">
								<Input
									id="tags"
									value={tagInput}
									onChange={(e) => setTagInput(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											handleAddItem("tags", tagInput);
											setTagInput("");
										}
									}}
									placeholder="Add a tag and press Enter"
								/>
								<Button
									type="button"
									size="sm"
									onClick={() => {
										handleAddItem("tags", tagInput);
										setTagInput("");
									}}
								>
									Add
								</Button>
							</div>
							<div className="flex flex-wrap gap-1 mt-2">
								{formData.tags?.map((tag, index) => (
									<Badge key={index} variant="secondary">
										{tag}
										<button
											onClick={() => handleRemoveItem("tags", index)}
											className="ml-2 font-mono font-bold hover:text-red-500"
										>
											x
										</button>
									</Badge>
								))}
							</div>
						</div>

						{/* Companies */}
						<div className="space-y-2">
							<Label htmlFor="companies">Companies</Label>
							<div className="flex items-center gap-2">
								<Input
									id="companies"
									value={companyInput}
									onChange={(e) => setCompanyInput(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											handleAddItem("companies", companyInput);
											setCompanyInput("");
										}
									}}
									placeholder="Add a company and press Enter"
								/>
								<Button
									type="button"
									size="sm"
									onClick={() => {
										handleAddItem("companies", companyInput);
										setCompanyInput("");
									}}
								>
									Add
								</Button>
							</div>
							<div className="flex flex-wrap gap-1 mt-2">
								{formData.companies?.map((company, index) => (
									<Badge key={index} variant="secondary">
										{company}
										<button
											onClick={() => handleRemoveItem("companies", index)}
											className="ml-2 font-mono font-bold hover:text-red-500"
										>
											x
										</button>
									</Badge>
								))}
							</div>
						</div>

						{/* Detailed Fields */}
						<div className="space-y-2">
							<Label htmlFor="constraints">Constraints</Label>
							<Textarea
								id="constraints"
								name="constraints"
								placeholder="e.g., 2 <= nums.length <= 10^4"
								value={formData.constraints || ""}
								onChange={handleChange}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="editorial">Editorial</Label>
							<Textarea
								id="editorial"
								name="editorial"
								placeholder="Link to the editorial or explanation"
								value={formData.editorial || ""}
								onChange={handleChange}
							/>
						</div>

						{/* Platform Links */}
						<div className="space-y-3 pt-2">
							<h4 className="font-medium text-sm">Platform Links</h4>
							<div className="space-y-2 rounded-md border p-4">
								<div className="space-y-2">
									<Label htmlFor="leetcode">LeetCode</Label>
									<Input
										id="leetcode"
										name="leetcode"
										placeholder="URL"
										value={formData.platformLinks?.leetcode || ""}
										onChange={handlePlatformLinkChange}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="gfg">GeeksforGeeks</Label>
									<Input
										id="gfg"
										name="gfg"
										placeholder="URL"
										value={formData.platformLinks?.gfg || ""}
										onChange={handlePlatformLinkChange}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="hackerrank">HackerRank</Label>
									<Input
										id="hackerrank"
										name="hackerrank"
										placeholder="URL"
										value={formData.platformLinks?.hackerrank || ""}
										onChange={handlePlatformLinkChange}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="codeforces">Codeforces</Label>
									<Input
										id="codeforces"
										name="codeforces"
										placeholder="URL"
										value={formData.platformLinks?.codeforces || ""}
										onChange={handlePlatformLinkChange}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="custom">Custom</Label>
									<Input
										id="custom"
										name="custom"
										placeholder="URL"
										value={formData.platformLinks?.custom || ""}
										onChange={handlePlatformLinkChange}
									/>
								</div>
							</div>
						</div>

						{/* Examples */}
						<div className="space-y-3 pt-2">
							<div className="flex justify-between items-center">
								<h4 className="font-medium text-sm">Examples</h4>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={addExample}
								>
									<PlusCircle className="mr-2 h-4 w-4" />
									Add Example
								</Button>
							</div>
							{formData.examples?.map((ex, index) => (
								<div
									key={index}
									className="space-y-2 rounded-md border p-4 relative"
								>
									<Button
										variant="ghost"
										size="icon"
										className="absolute top-1 right-1 h-7 w-7"
										onClick={() => removeExample(index)}
									>
										<Trash2 className="h-4 w-4 text-red-500" />
									</Button>
									<div className="space-y-1">
										<Label>Input</Label>
										<Textarea
											placeholder="nums = [2,7,11,15], target = 9"
											value={ex.input}
											onChange={(e) =>
												handleExampleChange(index, "input", e.target.value)
											}
										/>
									</div>
									<div className="space-y-1">
										<Label>Output</Label>
										<Textarea
											placeholder="[0,1]"
											value={ex.output}
											onChange={(e) =>
												handleExampleChange(index, "output", e.target.value)
											}
										/>
									</div>
									<div className="space-y-1">
										<Label>Explanation</Label>
										<Textarea
											placeholder="Because nums[0] + nums[1] == 9, we return [0, 1]."
											value={ex.explanation}
											onChange={(e) =>
												handleExampleChange(
													index,
													"explanation",
													e.target.value
												)
											}
										/>
									</div>
								</div>
							))}
							<div />
						</div>

						{/* Hints */}
						<div className="space-y-3 pt-2">
							<div className="flex justify-between items-center">
								<h4 className="font-medium text-sm">Hints</h4>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={addHint}
								>
									<PlusCircle className="mr-2 h-4 w-4" />
									Add Hint
								</Button>
							</div>
							{formData.hints?.map((hint, index) => (
								<div key={index} className="flex items-start gap-2">
									<Textarea
										placeholder="Enter hint..."
										value={hint}
										onChange={(e) => handleHintChange(index, e.target.value)}
									/>
									<Button
										variant="ghost"
										size="icon"
										className="shrink-0"
										onClick={() => handleRemoveItem("hints", index)}
									>
										<Trash2 className="h-4 w-4 text-red-500" />
									</Button>
								</div>
							))}
						</div>

						{/* Status */}
						<div className="flex items-center space-x-2 pt-2">
							<Checkbox
								id="isActive"
								checked={formData.isActive}
								onCheckedChange={handleCheckboxChange}
							/>
							<Label
								htmlFor="isActive"
								className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>
								Problem is Active
							</Label>
						</div>
					</CardContent>
					<CardFooter className="flex-shrink-0 flex flex-col gap-2">
						<Button
							onClick={handleSubmit}
							disabled={isSubmitting}
							className="w-full"
						>
							{isSubmitting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									{editId ? "Updating..." : "Adding..."}
								</>
							) : editId ? (
								"Update Problem"
							) : (
								"Add Problem"
							)}
						</Button>
						{editId && (
							<Button
								variant="outline"
								className="w-full"
								onClick={() => {
									setEditId(null);
									setFormData(getInitialFormData());
								}}
							>
								Cancel Edit
							</Button>
						)}
					</CardFooter>
				</Card>

				{/* Table Section */}
				<Card className="flex flex-col">
					<CardHeader className="flex-shrink-0">
						<CardTitle>All Problems</CardTitle>
						<CardDescription>
							View and manage all available problems.
						</CardDescription>
					</CardHeader>
					<CardContent className="flex-1 overflow-y-auto">
						{loading && (
							<div className="flex justify-center py-8">
								<Loader2 className="h-8 w-8 animate-spin text-gray-500" />
							</div>
						)}
						{error && (
							<Alert variant="destructive" className="mb-4">
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}
						{!loading &&
							!error &&
							(problems.length === 0 ? (
								<div className="text-center py-8 text-gray-500">
									No problems found.
								</div>
							) : (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Title</TableHead>
											<TableHead>Difficulty</TableHead>
											<TableHead>Category</TableHead>
											<TableHead className="text-right">Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{problems.map((problem, idx) => (
											<ProblemRow
												key={idx}
												problem={problem}
												onEdit={handleEdit}
												onDelete={handleDelete}
											/>
										))}
									</TableBody>
								</Table>
							))}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
