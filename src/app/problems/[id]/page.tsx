"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProblem } from "@/hooks/useProblem";
import type { IProblem } from "@/types/problem.type";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
	ArrowLeft,
	ExternalLink,
	Star,
	Code,
	Users,
	Tag,
	Building,
	AlertTriangle,
	BookOpen,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProblemPage() {
	const params = useParams();
	const router = useRouter();
	const { fetchOne, loading, error } = useProblem();
	const [problem, setProblem] = useState<IProblem | null>(null);

	useEffect(() => {
		const loadProblem = async () => {
			if (params.id) {
				const data = await fetchOne(params.id as string);
				setProblem(data);
			}
		};
		loadProblem();
	}, [params.id]);

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

	if (error) {
		return (
			<div className="container mx-auto py-8 px-4">
				<Alert variant="destructive" className="mb-4">
					<AlertTriangle className="h-4 w-4" />
					<AlertTitle>Error</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
				<Button onClick={() => router.back()} variant="outline">
					<ArrowLeft className="mr-2 h-4 w-4" /> Go Back
				</Button>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-8 px-4">
			<Button onClick={() => router.back()} variant="outline" className="mb-6">
				<ArrowLeft className="mr-2 h-4 w-4" /> Back to Problems
			</Button>

			{loading || !problem ? (
				<ProblemSkeleton />
			) : (
				<div className="space-y-6">
					{/* Problem Header */}
					<div className="flex flex-col gap-4">
						<div className="flex flex-wrap items-center justify-between gap-4">
							<h1 className="text-3xl font-bold">{problem.title}</h1>
							<div className="flex flex-wrap gap-2">
								<Badge className={getDifficultyColor(problem.difficulty)}>
									{problem.difficulty}
								</Badge>
								<Badge variant="outline">{problem.category}</Badge>
							</div>
						</div>
						<div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
							<div className="flex items-center">
								<Users className="mr-1 h-4 w-4" />
								<span>{problem.totalAttempts} attempts</span>
							</div>
							<div className="flex items-center">
								<Code className="mr-1 h-4 w-4" />
								<span>{problem.totalSolved} solved</span>
							</div>
							<div className="flex items-center">
								<Star className="mr-1 h-4 w-4" />
								<span>{problem.averageRating.toFixed(1)} rating</span>
							</div>
						</div>
					</div>

					<Tabs defaultValue="description" className="w-full">
						<TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
							<TabsTrigger value="description">Description</TabsTrigger>
							<TabsTrigger value="examples">Examples</TabsTrigger>
							<TabsTrigger value="hints">Hints</TabsTrigger>
							<TabsTrigger value="editorial">Editorial</TabsTrigger>
							<TabsTrigger value="links">Links</TabsTrigger>
							<TabsTrigger value="metadata">Metadata</TabsTrigger>
						</TabsList>

						{/* Description Tab */}
						<TabsContent value="description" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle>Problem Description</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="prose max-w-none">
										<div
											dangerouslySetInnerHTML={{ __html: problem.description }}
										/>
									</div>

									{problem.constraints && (
										<>
											<Separator className="my-6" />
											<div>
												<h3 className="text-lg font-semibold mb-2">
													Constraints
												</h3>
												<div className="prose max-w-none">
													<div
														dangerouslySetInnerHTML={{
															__html: problem.constraints,
														}}
													/>
												</div>
											</div>
										</>
									)}
								</CardContent>
							</Card>
						</TabsContent>

						{/* Examples Tab */}
						<TabsContent value="examples" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle>Examples</CardTitle>
								</CardHeader>
								<CardContent>
									{problem.examples && problem.examples.length > 0 ? (
										<div className="space-y-6">
											{problem.examples.map((example, index) => (
												<div key={index} className="space-y-4">
													<h3 className="text-lg font-semibold">
														Example {index + 1}
													</h3>
													<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
														<div className="space-y-2">
															<div className="font-medium">Input:</div>
															<pre className="bg-muted p-4 rounded-md overflow-x-auto">
																<code>{example.input}</code>
															</pre>
														</div>
														<div className="space-y-2">
															<div className="font-medium">Output:</div>
															<pre className="bg-muted p-4 rounded-md overflow-x-auto">
																<code>{example.output}</code>
															</pre>
														</div>
													</div>
													{example.explanation && (
														<div className="space-y-2">
															<div className="font-medium">Explanation:</div>
															<div className="prose max-w-none">
																<div
																	dangerouslySetInnerHTML={{
																		__html: example.explanation,
																	}}
																/>
															</div>
														</div>
													)}
													{index < problem.examples.length - 1 && (
														<Separator className="my-4" />
													)}
												</div>
											))}
										</div>
									) : (
										<p className="text-muted-foreground">
											No examples available for this problem.
										</p>
									)}
								</CardContent>
							</Card>
						</TabsContent>

						{/* Hints Tab */}
						<TabsContent value="hints" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle>Hints</CardTitle>
									<CardDescription>
										Use these hints if you're stuck
									</CardDescription>
								</CardHeader>
								<CardContent>
									{problem.hints && problem.hints.length > 0 ? (
										<div className="space-y-4">
											{problem.hints.map((hint, index) => (
												<div key={index} className="p-4 bg-muted rounded-md">
													<h3 className="font-medium mb-2">Hint {index + 1}</h3>
													<div className="prose max-w-none">
														<div dangerouslySetInnerHTML={{ __html: hint }} />
													</div>
												</div>
											))}
										</div>
									) : (
										<p className="text-muted-foreground">
											No hints available for this problem.
										</p>
									)}
								</CardContent>
							</Card>
						</TabsContent>

						{/* Editorial Tab */}
						<TabsContent value="editorial" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle>Editorial</CardTitle>
									<CardDescription>
										Detailed solution and explanation
									</CardDescription>
								</CardHeader>
								<CardContent>
									{problem.editorial ? (
										<div className="prose max-w-none">
											<div
												dangerouslySetInnerHTML={{ __html: problem.editorial }}
											/>
										</div>
									) : (
										<p className="text-muted-foreground">
											No editorial available for this problem yet.
										</p>
									)}
								</CardContent>
							</Card>
						</TabsContent>

						{/* Links Tab */}
						<TabsContent value="links" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle>Platform Links</CardTitle>
									<CardDescription>
										Solve this problem on other platforms
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{problem.platformLinks?.leetcode && (
											<a
												href={problem.platformLinks.leetcode}
												target="_blank"
												rel="noopener noreferrer"
												className="flex items-center p-4 bg-muted rounded-md hover:bg-muted/80"
											>
												<div className="flex-1">LeetCode</div>
												<ExternalLink className="h-4 w-4" />
											</a>
										)}
										{problem.platformLinks?.gfg && (
											<a
												href={problem.platformLinks.gfg}
												target="_blank"
												rel="noopener noreferrer"
												className="flex items-center p-4 bg-muted rounded-md hover:bg-muted/80"
											>
												<div className="flex-1">GeeksForGeeks</div>
												<ExternalLink className="h-4 w-4" />
											</a>
										)}
										{problem.platformLinks?.hackerrank && (
											<a
												href={problem.platformLinks.hackerrank}
												target="_blank"
												rel="noopener noreferrer"
												className="flex items-center p-4 bg-muted rounded-md hover:bg-muted/80"
											>
												<div className="flex-1">HackerRank</div>
												<ExternalLink className="h-4 w-4" />
											</a>
										)}
										{problem.platformLinks?.codeforces && (
											<a
												href={problem.platformLinks.codeforces}
												target="_blank"
												rel="noopener noreferrer"
												className="flex items-center p-4 bg-muted rounded-md hover:bg-muted/80"
											>
												<div className="flex-1">CodeForces</div>
												<ExternalLink className="h-4 w-4" />
											</a>
										)}
										{problem.platformLinks?.custom && (
											<a
												href={problem.platformLinks.custom}
												target="_blank"
												rel="noopener noreferrer"
												className="flex items-center p-4 bg-muted rounded-md hover:bg-muted/80"
											>
												<div className="flex-1">Custom Link</div>
												<ExternalLink className="h-4 w-4" />
											</a>
										)}
										{!problem.platformLinks?.leetcode &&
											!problem.platformLinks?.gfg &&
											!problem.platformLinks?.hackerrank &&
											!problem.platformLinks?.codeforces &&
											!problem.platformLinks?.custom && (
												<p className="text-muted-foreground col-span-2">
													No platform links available for this problem.
												</p>
											)}
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Metadata Tab */}
						<TabsContent value="metadata" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle>Problem Metadata</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										{/* Tags */}
										<div className="space-y-2">
											<h3 className="text-lg font-semibold flex items-center">
												<Tag className="mr-2 h-4 w-4" /> Tags
											</h3>
											<div className="flex flex-wrap gap-2">
												{problem.tags && problem.tags.length > 0 ? (
													problem.tags.map((tag, index) => (
														<Badge key={index} variant="secondary">
															{tag}
														</Badge>
													))
												) : (
													<p className="text-muted-foreground">No tags</p>
												)}
											</div>
										</div>

										{/* Companies */}
										<div className="space-y-2">
											<h3 className="text-lg font-semibold flex items-center">
												<Building className="mr-2 h-4 w-4" /> Companies
											</h3>
											<div className="flex flex-wrap gap-2">
												{problem.companies && problem.companies.length > 0 ? (
													problem.companies.map((company, index) => (
														<Badge key={index} variant="outline">
															{company}
														</Badge>
													))
												) : (
													<p className="text-muted-foreground">No companies</p>
												)}
											</div>
										</div>

										{/* Additional Info */}
										<div className="col-span-1 md:col-span-2">
											<h3 className="text-lg font-semibold flex items-center mb-2">
												<BookOpen className="mr-2 h-4 w-4" /> Additional
												Information
											</h3>
											<dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
												<div className="flex justify-between sm:block">
													<dt className="text-muted-foreground">Slug</dt>
													<dd className="font-medium">{problem.slug}</dd>
												</div>
												<div className="flex justify-between sm:block">
													<dt className="text-muted-foreground">Status</dt>
													<dd className="font-medium">
														{problem.isActive ? "Active" : "Inactive"}
													</dd>
												</div>
												<div className="flex justify-between sm:block">
													<dt className="text-muted-foreground">Created</dt>
													<dd className="font-medium">
														{new Date(problem.createdAt).toLocaleDateString()}
													</dd>
												</div>
												<div className="flex justify-between sm:block">
													<dt className="text-muted-foreground">
														Last Updated
													</dt>
													<dd className="font-medium">
														{new Date(problem.updatedAt).toLocaleDateString()}
													</dd>
												</div>
											</dl>
										</div>
									</div>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</div>
			)}
		</div>
	);
}

// Loading skeleton component
function ProblemSkeleton() {
	return (
		<div className="space-y-6">
			<div className="space-y-4">
				<Skeleton className="h-10 w-2/3" />
				<div className="flex gap-2">
					<Skeleton className="h-6 w-20" />
					<Skeleton className="h-6 w-24" />
				</div>
				<div className="flex gap-4">
					<Skeleton className="h-5 w-24" />
					<Skeleton className="h-5 w-24" />
					<Skeleton className="h-5 w-24" />
				</div>
			</div>

			<div className="space-y-2">
				<Skeleton className="h-10 w-full" />
				<Card>
					<CardHeader>
						<Skeleton className="h-7 w-40" />
					</CardHeader>
					<CardContent className="space-y-4">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-3/4" />
						<Skeleton className="h-4 w-5/6" />
						<Skeleton className="h-4 w-full" />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
