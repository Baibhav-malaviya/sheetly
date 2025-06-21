"use client";

import { useState } from "react";
import ProblemSelector from "@/components/templatess/ProblemSelector";
import TemplateForm from "@/components/templatess/TemplateForm";
import { useProblem } from "@/hooks/useProblem";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { UnauthorizedError } from "@/components/ErrorState";

export default function CreateTemplatePage() {
	const { session, isAdmin } = useAuth();
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const { problems } = useProblem();

	if (!session) return <UnauthorizedError />;

	if (!isAdmin)
		return (
			<UnauthorizedError
				title="Access Denied"
				message="You need to to be admin to access this resource."
			/>
		);

	return (
		<div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
			<div className="container mx-auto px-4 py-8 max-w-7xl">
				{/* Page Header */}
				<div className="mb-8">
					<div className="flex items-center gap-3 mb-2">
						<div className="p-2 bg-primary/10 rounded-lg">
							<Plus className="h-6 w-6 text-primary" />
						</div>
						<h1 className="text-3xl font-bold tracking-tight">
							Create Template
						</h1>
					</div>
					<p className="text-muted-foreground text-lg">
						Build a custom problem template by selecting problems and
						configuring details
					</p>
				</div>

				{/* Main Content */}
				<div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
					{/* Left Column - Problem Selection */}
					<div className="space-y-6">
						<ProblemSelector
							problems={problems || []}
							selected={selectedIds}
							setSelected={setSelectedIds}
						/>
					</div>

					{/* Right Column - Template Form */}
					<div className="space-y-6">
						<div className="sticky top-8">
							<TemplateForm selectedIds={selectedIds} />

							{/* Quick Stats */}
							{selectedIds.length > 0 && (
								<Card className="mt-6">
									<CardContent className="p-4">
										<h3 className="font-medium mb-3">Template Overview</h3>
										<div className="grid grid-cols-2 gap-4 text-sm">
											<div>
												<span className="text-muted-foreground">
													Total Problems:
												</span>
												<div className="font-medium">{selectedIds.length}</div>
											</div>
											<div>
												<span className="text-muted-foreground">
													Estimated Time:
												</span>
												<div className="font-medium">
													{selectedIds.length * 30} min
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							)}
						</div>
					</div>
				</div>

				{/* Empty State */}
				{(!problems || problems.length === 0) && (
					<Card className="mt-8">
						<CardContent className="p-8 text-center">
							<FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
							<h3 className="text-lg font-medium mb-2">
								No Problems Available
							</h3>
							<p className="text-muted-foreground">
								There are no problems available to create a template. Please add
								some problems first.
							</p>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}
