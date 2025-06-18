"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useTemplates } from "@/hooks/useTemplates";
import {
	PlusCircle,
	Search,
	Filter,
	FileText,
	User,
	Clock,
	BarChart3,
	CheckCircle,
	Calendar,
	Hash,
	Tag,
} from "lucide-react";
import Link from "next/link";
import ErrorState, { NetworkError, ServerError } from "@/components/ErrorState";
import { useAuth } from "@/hooks/useAuth";

export default function TemplatesPage() {
	const { templates, loading, error } = useTemplates();
	const { isAdmin } = useAuth();

	const [searchTerm, setSearchTerm] = useState("");
	const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
	const [categoryFilter, setCategoryFilter] = useState<string>("all");
	const [sortBy, setSortBy] = useState<string>("newest");

	const filteredAndSortedTemplates = useMemo(() => {
		if (!templates) return [];

		const filtered = templates.filter((template) => {
			const matchesSearch =
				template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				template.description
					?.toLowerCase()
					.includes(searchTerm.toLowerCase()) ||
				template.author.toLowerCase().includes(searchTerm.toLowerCase());

			const matchesDifficulty =
				difficultyFilter === "all" || template.difficulty === difficultyFilter;
			const matchesCategory =
				categoryFilter === "all" || template.category === categoryFilter;

			return matchesSearch && matchesDifficulty && matchesCategory;
		});

		// Sort templates
		filtered.sort((a, b) => {
			switch (sortBy) {
				case "newest":
					return (
						new Date(b.createdAt || 0).getTime() -
						new Date(a.createdAt || 0).getTime()
					);
				case "oldest":
					return (
						new Date(a.createdAt || 0).getTime() -
						new Date(b.createdAt || 0).getTime()
					);
				case "name":
					return a.name.localeCompare(b.name);
				case "problems":
					return (b.problemCount || 0) - (a.problemCount || 0);
				case "difficulty":
					const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
					return (
						(difficultyOrder[a.difficulty as keyof typeof difficultyOrder] ||
							0) -
						(difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 0)
					);
				default:
					return 0;
			}
		});

		return filtered;
	}, [templates, searchTerm, difficultyFilter, categoryFilter, sortBy]);

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

	const getStats = () => {
		if (!templates)
			return { total: 0, official: 0, categories: 0, avgProblems: 0 };

		const official = templates.filter((t) => t.isOfficial).length;
		const categories = new Set(templates.map((t) => t.category)).size;
		const avgProblems = Math.round(
			templates.reduce((sum, t) => sum + (t.problemCount || 0), 0) /
				templates.length
		);

		return {
			total: templates.length,
			official,
			categories,
			avgProblems,
		};
	};

	const stats = getStats();

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
				<div className="container mx-auto px-4 py-8 max-w-7xl">
					<div className="space-y-8">
						{/* Header Skeleton */}
						<div className="space-y-4">
							<Skeleton className="h-8 w-64" />
							<Skeleton className="h-4 w-96" />
						</div>

						{/* Stats Skeleton */}
						<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
							{[1, 2, 3, 4].map((i) => (
								<Skeleton key={i} className="h-24" />
							))}
						</div>

						{/* Filters Skeleton */}
						<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
							{[1, 2, 3, 4].map((i) => (
								<Skeleton key={i} className="h-10" />
							))}
						</div>

						{/* Templates Skeleton */}
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{[1, 2, 3, 4, 5, 6].map((i) => (
								<Skeleton key={i} className="h-48" />
							))}
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		// Handle different types of errors
		if (error.includes("fetch") || error.includes("network")) {
			return (
				<NetworkError
					title="Failed to Load Templates"
					message="Unable to fetch templates. Please check your connection and try again."
				/>
			);
		}

		if (error.includes("500") || error.includes("server")) {
			return (
				<ServerError
					title="Server Error"
					message="Something went wrong while loading templates. Please try again later."
				/>
			);
		}

		return <ErrorState />;
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
			<div className="container mx-auto px-4 py-8 max-w-7xl">
				{/* Header */}
				<div className="mb-8">
					<div className="flex items-center justify-between mb-4">
						<div>
							<h1 className="text-4xl font-bold tracking-tight mb-2">
								DSA Templates
							</h1>
							<p className="text-lg text-muted-foreground">
								Discover curated problem sets to enhance your coding skills
							</p>
						</div>
						{isAdmin && (
							<Link href="/templatess/create">
								<Button size="lg" className="gap-2">
									<PlusCircle className="h-5 w-5" />
									Create Template
								</Button>
							</Link>
						)}
					</div>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-blue-100 rounded-lg">
									<FileText className="h-5 w-5 text-blue-600" />
								</div>
								<div>
									<p className="text-2xl font-bold">{stats.total}</p>
									<p className="text-sm text-muted-foreground">
										Total Templates
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-6">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-green-100 rounded-lg">
									<CheckCircle className="h-5 w-5 text-green-600" />
								</div>
								<div>
									<p className="text-2xl font-bold">{stats.official}</p>
									<p className="text-sm text-muted-foreground">Official</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-6">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-purple-100 rounded-lg">
									<Tag className="h-5 w-5 text-purple-600" />
								</div>
								<div>
									<p className="text-2xl font-bold">{stats.categories}</p>
									<p className="text-sm text-muted-foreground">Categories</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-6">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-orange-100 rounded-lg">
									<BarChart3 className="h-5 w-5 text-orange-600" />
								</div>
								<div>
									<p className="text-2xl font-bold">{stats.avgProblems}</p>
									<p className="text-sm text-muted-foreground">Avg Problems</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Filters */}
				<Card className="mb-8">
					<CardContent className="p-6">
						<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
							<div className="space-y-2">
								<label className="text-sm font-medium">Search Templates</label>
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									<Input
										placeholder="Search by name, description, or author..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="pl-10"
									/>
								</div>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium">Difficulty</label>
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
								<label className="text-sm font-medium">Category</label>
								<Select
									value={categoryFilter}
									onValueChange={setCategoryFilter}
								>
									<SelectTrigger>
										<SelectValue placeholder="All categories" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Categories</SelectItem>
										{Array.from(
											new Set(templates?.map((t) => t.category).filter(Boolean))
										).map((category) => (
											<SelectItem key={category} value={category}>
												{category}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium">Sort By</label>
								<Select value={sortBy} onValueChange={setSortBy}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="newest">Newest First</SelectItem>
										<SelectItem value="oldest">Oldest First</SelectItem>
										<SelectItem value="name">Name (A-Z)</SelectItem>
										<SelectItem value="problems">Most Problems</SelectItem>
										<SelectItem value="difficulty">Difficulty</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						{/* Active Filters */}
						{(searchTerm ||
							difficultyFilter !== "all" ||
							categoryFilter !== "all") && (
							<div className="flex items-center gap-2 mt-4 pt-4 border-t">
								<Filter className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm text-muted-foreground">
									Active filters:
								</span>
								{searchTerm && (
									<Badge variant="secondary">Search: {searchTerm}</Badge>
								)}
								{difficultyFilter !== "all" && (
									<Badge variant="secondary">
										Difficulty: {difficultyFilter}
									</Badge>
								)}
								{categoryFilter !== "all" && (
									<Badge variant="secondary">Category: {categoryFilter}</Badge>
								)}
								<Button
									variant="ghost"
									size="sm"
									onClick={() => {
										setSearchTerm("");
										setDifficultyFilter("all");
										setCategoryFilter("all");
									}}
								>
									Clear All
								</Button>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Results Summary */}
				<div className="flex items-center justify-between mb-6">
					<p className="text-muted-foreground">
						Showing {filteredAndSortedTemplates.length} of{" "}
						{templates?.length || 0} templates
					</p>
				</div>

				{/* Templates Grid */}
				{filteredAndSortedTemplates.length === 0 ? (
					<Card className="text-center py-12">
						<CardContent>
							<Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
							<h3 className="text-lg font-medium mb-2">No Templates Found</h3>
							<p className="text-muted-foreground mb-4">
								{templates?.length === 0
									? "No templates have been created yet."
									: "Try adjusting your search criteria or filters."}
							</p>
							{templates?.length === 0 && (
								<Link href="/templatess/create">
									<Button>
										<PlusCircle className="h-4 w-4 mr-2" />
										Create First Template
									</Button>
								</Link>
							)}
						</CardContent>
					</Card>
				) : (
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{filteredAndSortedTemplates.map((template, idx) => (
							<Link href={`/templatess/${template._id}`} key={idx}>
								<Card className="h-full hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer group">
									<CardHeader className="pb-3">
										<div className="flex items-start justify-between mb-2">
											<CardTitle className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
												{template.name}
											</CardTitle>
											{template.isOfficial && (
												<Badge
													variant="secondary"
													className="bg-blue-100 text-blue-800 border-blue-200 shrink-0 ml-2"
												>
													<CheckCircle className="h-3 w-3 mr-1" />
													Official
												</Badge>
											)}
										</div>
										<CardDescription className="line-clamp-2">
											{template.description || "No description provided"}
										</CardDescription>
									</CardHeader>

									<CardContent className="space-y-4">
										{/* Difficulty and Category */}
										<div className="flex items-center gap-2">
											<Badge
												className={getDifficultyColor(template.difficulty)}
												variant="outline"
											>
												{template.difficulty}
											</Badge>
											<Badge variant="outline">{template.category}</Badge>
										</div>

										{/* Stats */}
										<div className="grid grid-cols-2 gap-4 text-sm">
											<div className="flex items-center gap-2">
												<Hash className="h-4 w-4 text-muted-foreground" />
												<span className="text-muted-foreground">Problems:</span>
												<span className="font-medium">
													{template.problemCount || 0}
												</span>
											</div>
											<div className="flex items-center gap-2">
												<Clock className="h-4 w-4 text-muted-foreground" />
												<span className="text-muted-foreground">Est:</span>
												<span className="font-medium">
													{(template.problemCount || 0) * 30}m
												</span>
											</div>
										</div>

										{/* Author and Date */}
										<div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
											<div className="flex items-center gap-1">
												<User className="h-3 w-3" />
												<span>By {template.author}</span>
											</div>
											{template.createdAt && (
												<div className="flex items-center gap-1">
													<Calendar className="h-3 w-3" />
													<span>
														{new Date(template.createdAt).toLocaleDateString()}
													</span>
												</div>
											)}
										</div>
									</CardContent>
								</Card>
							</Link>
						))}
					</div>
				)}

				{/* Load More Button (if needed for pagination) */}
				{filteredAndSortedTemplates.length > 0 && (
					<div className="text-center mt-12">
						<p className="text-sm text-muted-foreground">
							Showing all {filteredAndSortedTemplates.length} templates
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
