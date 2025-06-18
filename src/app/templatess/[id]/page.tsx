"use client";

import { useTemplate } from "@/hooks/useTemplates";
import { useParams, useRouter } from "next/navigation";
import { removeProblemFromTemplate } from "@/lib/api/templates";
import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	FileText,
	User,
	Calendar,
	Clock,
	BarChart3,
	Trash2,
	Edit,
	Share2,
	Download,
	Play,
	CheckCircle,
	AlertCircle,
	ArrowLeft,
	Tag,
	Hash,
	Eye,
	ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { ITemplate, ITemplateDocument } from "@/types/template.type";
import { NotFoundError } from "@/components/ErrorState";
import Link from "next/link";

export default function TemplateDetailPage() {
	const params = useParams();
	const router = useRouter();

	const { template, setTemplate, loading, error } = useTemplate(
		params.id as string
	);

	const [removingProblem, setRemovingProblem] = useState<string | null>(null);

	const handleRemove = async (problemId: string) => {
		if (!params.id) return;

		setRemovingProblem(problemId);
		try {
			await removeProblemFromTemplate(params.id as string, problemId);

			setTemplate((prev) =>
				prev
					? ({
							...prev,
							problems: prev.problems.filter(
								(problem) => problem.problemId.toString() !== problemId
							),
							problemCount: prev.problemCount - 1,
					  } as ITemplateDocument)
					: null
			);

			toast("Problem removed", {
				description:
					"The problem has been successfully removed from the template.",
			});
		} catch (e: any) {
			toast("Error", {
				description: "Failed to remove problem: " + e.message,
			});
		} finally {
			setRemovingProblem(null);
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

	const getEstimatedTime = (problemCount: number) => {
		return problemCount * 30; // 30 minutes per problem
	};

	const getDifficultyStats = () => {
		if (!template?.problems) return { easy: 0, medium: 0, hard: 0 };

		return template.problems.reduce(
			(acc, templateProblem) => {
				const difficulty = templateProblem.problem?.difficulty?.toLowerCase();
				if (difficulty === "easy") acc.easy++;
				else if (difficulty === "medium") acc.medium++;
				else if (difficulty === "hard") acc.hard++;
				return acc;
			},
			{ easy: 0, medium: 0, hard: 0 }
		);
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
				<div className="container mx-auto px-4 py-8 max-w-6xl">
					<div className="animate-pulse space-y-6">
						<div className="h-8 bg-muted rounded w-1/3"></div>
						<div className="h-4 bg-muted rounded w-2/3"></div>
						<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
							<div className="h-32 bg-muted rounded"></div>
							<div className="h-32 bg-muted rounded"></div>
							<div className="h-32 bg-muted rounded"></div>
							<div className="h-32 bg-muted rounded"></div>
						</div>
						<div className="space-y-4">
							{[1, 2, 3].map((i) => (
								<div key={i} className="h-20 bg-muted rounded"></div>
							))}
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (error || !template) {
		return (
			<NotFoundError
				showDefaultActions={false}
				actions={[
					{
						label: "Go Back",
						onClick: () => router.back(),
						variant: "outline",
						icon: ArrowLeft,
					},
				]}
			/>
		);
	}

	const difficultyStats = getDifficultyStats();

	return (
		<div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
			<div className="container mx-auto px-4 py-8 max-w-6xl">
				{/* Header */}
				<div className="flex justify-between items-center">
					<div className="flex items-center gap-4 mb-8">
						<Button variant="ghost" size="sm" onClick={() => router.back()}>
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back
						</Button>
						<Separator orientation="vertical" className="h-6" />
						<div className="flex items-center gap-2">
							<FileText className="h-5 w-5 text-primary" />
							<span className="text-sm text-muted-foreground">
								Template Details
							</span>
						</div>
					</div>
					<div>
						<Link href={`/templatess/${template._id}/add-problems`}>
							<Button>Add Problems</Button>
						</Link>
					</div>
				</div>

				{/* Template Header */}
				<Card className="mb-8">
					<CardHeader>
						<div className="flex items-start justify-between">
							<div className="space-y-2">
								<div className="flex items-center gap-3">
									<CardTitle className="text-3xl font-bold">
										{template.name}
									</CardTitle>
									<Badge
										className={getDifficultyColor(template.difficulty)}
										variant="outline"
									>
										{template.difficulty}
									</Badge>
									{template.isOfficial && (
										<Badge
											variant="secondary"
											className="bg-blue-100 text-blue-800 border-blue-200"
										>
											<CheckCircle className="h-3 w-3 mr-1" />
											Official
										</Badge>
									)}
								</div>
								<CardDescription className="text-base">
									{template.description || "No description provided"}
								</CardDescription>
								<div className="flex items-center gap-4 text-sm text-muted-foreground">
									<div className="flex items-center gap-1">
										<User className="h-4 w-4" />
										<span>By {template.author}</span>
									</div>
									{template.createdAt && (
										<div className="flex items-center gap-1">
											<Calendar className="h-4 w-4" />
											<span>
												Created{" "}
												{new Date(template.createdAt).toLocaleDateString()}
											</span>
										</div>
									)}
									<div className="flex items-center gap-1">
										<Tag className="h-4 w-4" />
										<span>{template.category}</span>
									</div>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<Button variant="outline" size="sm">
									<Download className="h-4 w-4 mr-2" />
									Export
								</Button>
							</div>
						</div>
					</CardHeader>
				</Card>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-blue-100 rounded-lg">
									<Hash className="h-5 w-5 text-blue-600" />
								</div>
								<div>
									<p className="text-2xl font-bold">
										{template.problems?.length || 0}
									</p>
									<p className="text-sm text-muted-foreground">Problems</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-6">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-green-100 rounded-lg">
									<Clock className="h-5 w-5 text-green-600" />
								</div>
								<div>
									<p className="text-2xl font-bold">
										{getEstimatedTime(template.problems?.length || 0)}m
									</p>
									<p className="text-sm text-muted-foreground">Est. Time</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-6">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-purple-100 rounded-lg">
									<BarChart3 className="h-5 w-5 text-purple-600" />
								</div>
								<div>
									<p className="text-2xl font-bold">{template.difficulty}</p>
									<p className="text-sm text-muted-foreground">Difficulty</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-6">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-orange-100 rounded-lg">
									<Tag className="h-5 w-5 text-orange-600" />
								</div>
								<div>
									<p className="text-2xl font-bold">{template.category}</p>
									<p className="text-sm text-muted-foreground">Category</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Problems List */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<FileText className="h-5 w-5" />
							Problems ({template.problems?.length || 0})
						</CardTitle>
						<CardDescription>
							Problems included in this template, ordered by difficulty and
							learning progression
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{template.problems && template.problems.length > 0 ? (
							template.problems.map((templateProblem, idx) => {
								const problem = templateProblem.problem;
								return (
									<Card key={idx} className="border-l-4 border-l-primary/20">
										<CardContent className="p-4">
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-4 flex-1">
													<div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full text-sm font-medium text-primary">
														{templateProblem.order + 1}
													</div>

													<div className="flex-1 min-w-0">
														<div className="flex items-center gap-2 mb-1">
															<h4 className="font-medium truncate">
																{problem?.title ||
																	`Problem ${templateProblem.order + 1}`}
															</h4>
															{problem?.difficulty && (
																<Badge
																	className={getDifficultyColor(
																		problem.difficulty
																	)}
																	variant="outline"
																>
																	{problem.difficulty}
																</Badge>
															)}
															{templateProblem.isRequired && (
																<Badge variant="secondary">Required</Badge>
															)}
														</div>

														{problem?.description && (
															<p className="text-sm text-muted-foreground line-clamp-2 mb-2">
																{problem.description}
															</p>
														)}

														{templateProblem.notes && (
															<p className="text-sm text-blue-600 bg-blue-50 p-2 rounded mb-2">
																<strong>Notes:</strong> {templateProblem.notes}
															</p>
														)}

														<div className="flex items-center gap-4 text-xs text-muted-foreground">
															<span>Est. 30 min</span>
															{problem?.category && (
																<span className="flex items-center gap-1">
																	<Tag className="h-3 w-3" />
																	{problem.category}
																</span>
															)}
															{problem?.tags && problem.tags.length > 0 && (
																<div className="flex items-center gap-1">
																	<Hash className="h-3 w-3" />
																	<span>
																		{problem.tags.slice(0, 2).join(", ")}
																	</span>
																	{problem.tags.length > 2 && (
																		<span>+{problem.tags.length - 2}</span>
																	)}
																</div>
															)}
														</div>
													</div>
												</div>

												<div className="flex items-center gap-2">
													{problem && (
														<Dialog>
															<DialogTrigger asChild>
																<Button variant="outline" size="sm">
																	<Eye className="h-4 w-4 mr-1" />
																	View
																</Button>
															</DialogTrigger>
															<DialogContent className="max-w-2xl">
																<DialogHeader>
																	<DialogTitle className="flex items-center gap-2">
																		{problem.title}
																		<Badge
																			className={getDifficultyColor(
																				problem.difficulty
																			)}
																			variant="outline"
																		>
																			{problem.difficulty}
																		</Badge>
																	</DialogTitle>
																	<DialogDescription>
																		{problem.description}
																	</DialogDescription>
																</DialogHeader>
																<div className="space-y-4">
																	<div>
																		<h4 className="font-medium mb-2">
																			Details
																		</h4>
																		<div className="grid grid-cols-2 gap-4 text-sm">
																			<div>
																				<span className="text-muted-foreground">
																					Category:
																				</span>
																				<div>{problem.category}</div>
																			</div>
																			<div>
																				<span className="text-muted-foreground">
																					Difficulty:
																				</span>
																				<div>{problem.difficulty}</div>
																			</div>
																		</div>
																	</div>
																	{problem.tags && problem.tags.length > 0 && (
																		<div>
																			<h4 className="font-medium mb-2">Tags</h4>
																			<div className="flex flex-wrap gap-1">
																				{problem.tags.map((tag, tagIdx) => (
																					<Badge key={tagIdx} variant="outline">
																						{tag}
																					</Badge>
																				))}
																			</div>
																		</div>
																	)}
																	<div className="flex justify-end">
																		<Button>
																			<ExternalLink className="h-4 w-4 mr-2" />
																			Open Problem
																		</Button>
																	</div>
																</div>
															</DialogContent>
														</Dialog>
													)}

													<AlertDialog>
														<AlertDialogTrigger asChild>
															<Button
																variant="outline"
																size="sm"
																className="text-red-600 hover:text-red-700 hover:bg-red-50"
																disabled={
																	removingProblem === templateProblem.problemId
																}
															>
																{removingProblem ===
																templateProblem.problemId ? (
																	<div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
																) : (
																	<Trash2 className="h-4 w-4" />
																)}
															</Button>
														</AlertDialogTrigger>
														<AlertDialogContent>
															<AlertDialogHeader>
																<AlertDialogTitle>
																	Remove Problem
																</AlertDialogTitle>
																<AlertDialogDescription>
																	Are you sure you want to remove "
																	{problem?.title || "this problem"}" from the
																	template? This action cannot be undone.
																</AlertDialogDescription>
															</AlertDialogHeader>
															<AlertDialogFooter>
																<AlertDialogCancel>Cancel</AlertDialogCancel>
																<AlertDialogAction
																	onClick={() =>
																		handleRemove(
																			templateProblem.problemId as string
																		)
																	}
																	className="bg-red-600 hover:bg-red-700"
																>
																	Remove
																</AlertDialogAction>
															</AlertDialogFooter>
														</AlertDialogContent>
													</AlertDialog>
												</div>
											</div>
										</CardContent>
									</Card>
								);
							})
						) : (
							<div className="text-center py-8">
								<FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
								<h3 className="text-lg font-medium mb-2">No Problems</h3>
								<p className="text-muted-foreground">
									This template doesn't have any problems yet.
								</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
