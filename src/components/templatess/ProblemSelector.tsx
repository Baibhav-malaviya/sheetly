"use client";

import { useState, useMemo } from "react";
import type { IProblem } from "@/types/problem.type";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Search, Filter, CheckSquare, Square, RotateCcw } from "lucide-react";
import { Label } from "@/components/ui/label";

interface Props {
	problems: IProblem[];
	selected: string[];
	setSelected: (ids: string[]) => void;
}

export default function ProblemSelector({
	problems,
	selected,
	setSelected,
}: Props) {
	const [searchTerm, setSearchTerm] = useState("");
	const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
	const [categoryFilter, setCategoryFilter] = useState<string>("all");

	const toggleSelect = (id: string) => {
		if (selected.includes(id)) {
			setSelected(selected.filter((pid) => pid !== id));
		} else {
			setSelected([...selected, id]);
		}
	};

	const toggleSelectAll = () => {
		if (selected.length === filteredProblems.length) {
			// Deselect all filtered problems
			const filteredIds = filteredProblems.map((p) => p._id.toString());
			setSelected(selected.filter((id) => !filteredIds.includes(id)));
		} else {
			// Select all filtered problems
			const filteredIds = filteredProblems.map((p) => p._id.toString());
			const newSelected = [...new Set([...selected, ...filteredIds])];
			setSelected(newSelected);
		}
	};

	const clearSelection = () => {
		setSelected([]);
	};

	const filteredProblems = useMemo(() => {
		return problems.filter((problem) => {
			const matchesSearch = problem.title
				.toLowerCase()
				.includes(searchTerm.toLowerCase());
			const matchesDifficulty =
				difficultyFilter === "all" || problem.difficulty === difficultyFilter;
			const matchesCategory =
				categoryFilter === "all" || problem.category === categoryFilter;
			return matchesSearch && matchesDifficulty && matchesCategory;
		});
	}, [problems, searchTerm, difficultyFilter, categoryFilter]);

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

	const allFilteredSelected =
		filteredProblems.length > 0 &&
		filteredProblems.every((problem) =>
			selected.includes(problem._id.toString())
		);

	return (
		<Card className="w-full">
			<CardHeader className="space-y-1">
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="text-xl font-bold flex items-center gap-2">
							<CheckSquare className="h-5 w-5 text-primary" />
							Select Problems
						</CardTitle>
						<CardDescription>
							Choose problems to include in your template ({selected.length}{" "}
							selected)
						</CardDescription>
					</div>
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={toggleSelectAll}
							disabled={filteredProblems.length === 0}
						>
							{allFilteredSelected ? (
								<>
									<Square className="h-4 w-4 mr-1" />
									Deselect All
								</>
							) : (
								<>
									<CheckSquare className="h-4 w-4 mr-1" />
									Select All
								</>
							)}
						</Button>
						{selected.length > 0 && (
							<Button variant="outline" size="sm" onClick={clearSelection}>
								<RotateCcw className="h-4 w-4 mr-1" />
								Clear
							</Button>
						)}
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Search and Filters */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="space-y-2">
						<Label htmlFor="search" className="text-sm font-medium">
							Search Problems
						</Label>
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								id="search"
								placeholder="Search by title..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10"
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label className="text-sm font-medium">Difficulty</Label>
						<Select
							value={difficultyFilter}
							onValueChange={setDifficultyFilter}
						>
							<SelectTrigger>
								<SelectValue placeholder="All difficulties" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Difficulties</SelectItem>
								<SelectItem value="Easy">Easy</SelectItem>
								<SelectItem value="Medium">Medium</SelectItem>
								<SelectItem value="Hard">Hard</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label className="text-sm font-medium">Category</Label>
						<Select value={categoryFilter} onValueChange={setCategoryFilter}>
							<SelectTrigger>
								<SelectValue placeholder="All categories" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Categories</SelectItem>
								{Array.from(
									new Set(problems.map((p) => p.category).filter(Boolean))
								).map((category) => (
									<SelectItem key={category} value={category}>
										{category}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* Results Summary */}
				<div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
					<div className="flex items-center gap-2">
						<Filter className="h-4 w-4 text-muted-foreground" />
						<span className="text-sm">
							Showing {filteredProblems.length} of {problems.length} problems
						</span>
					</div>
					{(searchTerm ||
						difficultyFilter !== "all" ||
						categoryFilter !== "all") && (
						<Button
							variant="ghost"
							size="sm"
							onClick={() => {
								setSearchTerm("");
								setDifficultyFilter("all");
								setCategoryFilter("all");
							}}
						>
							Clear Filters
						</Button>
					)}
				</div>

				{/* Problems List */}
				<div className="space-y-2 max-h-96 overflow-y-auto">
					{filteredProblems.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							<Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
							<p>No problems found matching your criteria</p>
						</div>
					) : (
						filteredProblems.map((problem, idx) => {
							const isSelected = selected.includes(problem._id.toString());
							return (
								<div
									key={problem._id.toString()}
									className={`flex items-center gap-3 p-3 rounded-lg border transition-all hover:bg-muted/50 cursor-pointer ${
										isSelected
											? "bg-primary/5 border-primary/20"
											: "bg-background"
									}`}
									onClick={() => toggleSelect(problem._id.toString())}
								>
									<Checkbox
										checked={isSelected}
										onChange={() => toggleSelect(problem._id.toString())}
										className="pointer-events-none"
									/>

									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-1">
											<span className="font-medium text-sm truncate">
												{problem.title}
											</span>
											<Badge
												className={getDifficultyColor(problem.difficulty)}
												variant="outline"
											>
												{problem.difficulty}
											</Badge>
											{problem.category && (
												<Badge
													className={getCategoryColor(problem.category)}
													variant="outline"
												>
													{problem.category}
												</Badge>
											)}
										</div>
										{problem.description && (
											<p className="text-xs text-muted-foreground truncate">
												{problem.description}
											</p>
										)}
									</div>

									<div className="text-xs text-muted-foreground">
										#{idx + 1}
									</div>
								</div>
							);
						})
					)}
				</div>

				{/* Selection Summary */}
				{selected.length > 0 && (
					<div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium">
								{selected.length} problem{selected.length !== 1 ? "s" : ""}{" "}
								selected
							</span>
							<Badge variant="secondary">{selected.length}</Badge>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
