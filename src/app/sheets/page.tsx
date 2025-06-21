"use client";

import { useState, useMemo } from "react";
import { useSheets } from "@/hooks/useSheets";
import type { CreateSheetData } from "@/lib/api/sheets";
import { SheetCategory, SheetDifficulty } from "@/types/sheet.type";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import PageSkeleton from "@/components/Skeleton";
// import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import SheetList from "@/components/sheets/SheetsList";
import {
	PlusCircle,
	Search,
	Filter,
	FileText,
	Globe,
	Lock,
	TrendingUp,
} from "lucide-react";
import Link from "next/link";

export default function MySheetsPage() {
	const { sheets, loading, error, addSheet } = useSheets();
	const [searchTerm, setSearchTerm] = useState("");
	const [categoryFilter, setCategoryFilter] = useState<string>("all");
	const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
	const [sortBy, setSortBy] = useState<string>("newest");

	const filteredAndSortedSheets = useMemo(() => {
		if (!sheets) return [];

		const filtered = sheets.filter((sheet) => {
			const matchesSearch =
				sheet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				sheet.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				sheet.tags?.some((tag) =>
					tag.toLowerCase().includes(searchTerm.toLowerCase())
				);

			const matchesCategory =
				categoryFilter === "all" || sheet.category === categoryFilter;
			const matchesDifficulty =
				difficultyFilter === "all" || sheet.difficulty === difficultyFilter;

			return matchesSearch && matchesCategory && matchesDifficulty;
		});

		// Sort sheets
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
				case "popular":
					return (b.social?.score || 0) - (a.social?.score || 0);
				case "views":
					return (b.social?.views || 0) - (a.social?.views || 0);
				default:
					return 0;
			}
		});

		return filtered;
	}, [sheets, searchTerm, categoryFilter, difficultyFilter, sortBy]);

	const getStats = () => {
		if (!sheets) return { total: 0, public: 0, private: 0, avgScore: 0 };

		const publicSheets = sheets.filter((s) => s.isPublic).length;
		const privateSheets = sheets.length - publicSheets;
		const avgScore = Math.round(
			sheets.reduce((sum, s) => sum + (s.social?.score || 0), 0) / sheets.length
		);

		return {
			total: sheets.length,
			public: publicSheets,
			private: privateSheets,
			avgScore,
		};
	};

	const stats = getStats();

	if (loading) {
		return (
			<PageSkeleton>
				<PageSkeleton.Header />
				<PageSkeleton.Stats />
				<PageSkeleton.Filters />
				<PageSkeleton.Grid />
			</PageSkeleton>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
				<div className="container mx-auto px-4 py-8 max-w-7xl">
					<Card className="text-center py-12">
						<CardContent>
							<div className="text-red-500 mb-4">
								<FileText className="h-12 w-12 mx-auto mb-2" />
							</div>
							<h2 className="text-xl font-semibold mb-2">
								Error Loading Sheets
							</h2>
							<p className="text-muted-foreground mb-4">{error}</p>
							<Button onClick={() => window.location.reload()}>
								Try Again
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
			<div className="container mx-auto px-4 py-8 max-w-7xl">
				<div className="space-y-8">
					{/* Header */}
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-4xl font-bold tracking-tight mb-2">
								My Study Sheets
							</h1>
							<p className="text-lg text-muted-foreground">
								Organize and manage your learning materials
							</p>
						</div>
						<Link href={"sheets/create"}>
							<Button size="lg" className="gap-2">
								<PlusCircle className="h-5 w-5" />
								Add New Sheet
							</Button>
						</Link>
					</div>

					{/* Stats Cards */}
					<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
						<Card>
							<CardContent className="p-6">
								<div className="flex items-center gap-3">
									<div className="p-2 bg-blue-100 rounded-lg">
										<FileText className="h-5 w-5 text-blue-600" />
									</div>
									<div>
										<p className="text-2xl font-bold">{stats.total}</p>
										<p className="text-sm text-muted-foreground">
											Total Sheets
										</p>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="p-6">
								<div className="flex items-center gap-3">
									<div className="p-2 bg-green-100 rounded-lg">
										<Globe className="h-5 w-5 text-green-600" />
									</div>
									<div>
										<p className="text-2xl font-bold">{stats.public}</p>
										<p className="text-sm text-muted-foreground">Public</p>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="p-6">
								<div className="flex items-center gap-3">
									<div className="p-2 bg-purple-100 rounded-lg">
										<Lock className="h-5 w-5 text-purple-600" />
									</div>
									<div>
										<p className="text-2xl font-bold">{stats.private}</p>
										<p className="text-sm text-muted-foreground">Private</p>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="p-6">
								<div className="flex items-center gap-3">
									<div className="p-2 bg-orange-100 rounded-lg">
										<TrendingUp className="h-5 w-5 text-orange-600" />
									</div>
									<div>
										<p className="text-2xl font-bold">{stats.avgScore}</p>
										<p className="text-sm text-muted-foreground">Avg Score</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Filters */}
					<Card>
						<CardContent className="p-6">
							<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
								<div className="space-y-2">
									<label className="text-sm font-medium">Search Sheets</label>
									<div className="relative">
										<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
										<Input
											placeholder="Search by name, description, or tags..."
											value={searchTerm}
											onChange={(e) => setSearchTerm(e.target.value)}
											className="pl-10"
										/>
									</div>
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
											{Object.values(SheetCategory).map((category) => (
												<SelectItem key={category} value={category}>
													{category}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
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
											{Object.values(SheetDifficulty).map((difficulty) => (
												<SelectItem key={difficulty} value={difficulty}>
													{difficulty}
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
											<SelectItem value="popular">Most Popular</SelectItem>
											<SelectItem value="views">Most Viewed</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							{/* Active Filters */}
							{(searchTerm ||
								categoryFilter !== "all" ||
								difficultyFilter !== "all") && (
								<div className="flex items-center gap-2 mt-4 pt-4 border-t">
									<Filter className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm text-muted-foreground">
										Active filters:
									</span>
									{searchTerm && (
										<Badge variant="secondary">Search: {searchTerm}</Badge>
									)}
									{categoryFilter !== "all" && (
										<Badge variant="secondary">
											Category: {categoryFilter}
										</Badge>
									)}
									{difficultyFilter !== "all" && (
										<Badge variant="secondary">
											Difficulty: {difficultyFilter}
										</Badge>
									)}
									<Button
										variant="ghost"
										size="sm"
										onClick={() => {
											setSearchTerm("");
											setCategoryFilter("all");
											setDifficultyFilter("all");
										}}
									>
										Clear All
									</Button>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Results Summary */}
					<div className="flex items-center justify-between">
						<p className="text-muted-foreground">
							Showing {filteredAndSortedSheets.length} of {sheets?.length || 0}{" "}
							sheets
						</p>
					</div>

					{/* Sheet List Component */}
					<SheetList sheets={filteredAndSortedSheets} />
				</div>
			</div>
		</div>
	);
}
