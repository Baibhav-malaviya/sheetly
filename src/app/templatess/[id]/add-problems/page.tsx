"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAddProblemsToTemplate } from "@/hooks/useTemplates";
import ProblemSelector from "@/components/templatess/ProblemSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Plus, ArrowLeft } from "lucide-react";
import { useProblem } from "@/hooks/useProblem";

export default function AddProblemsToTemplatePage() {
	const params = useParams();
	const router = useRouter();
	const templateId = params.id as string;
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const {
		problems,
		loading: problemsLoading,
		error: fetchError,
	} = useProblem();

	const { addProblems, adding, error } = useAddProblemsToTemplate(templateId);

	const handleAddProblems = async () => {
		if (selectedIds.length === 0) return;

		// Transform selected IDs into the format expected by addProblemsToTemplate
		const problemsToAdd = selectedIds.map((problemId, index) => ({
			problemId,
			// order: (template?.problems?.length || 0) + index + 1,//todo come here again
			order: index + 100,
			isRequired: true, // Default to required, you can make this configurable
			notes: "", // Default empty notes, you can add form fields for this
		}));

		await addProblems(problemsToAdd);

		// If successful, clear selection
		if (!error) {
			setSelectedIds([]);
		}
	};

	const handleGoBack = () => {
		router.push(`/templatess/${templateId}`);
	};

	if (problemsLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	if (fetchError) {
		return (
			<div className="container mx-auto px-4 py-8">
				<Alert variant="destructive">
					<AlertDescription>Error loading data: {fetchError}</AlertDescription>
				</Alert>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-6">
				<Button variant="ghost" onClick={handleGoBack} className="mb-4">
					<ArrowLeft className="h-4 w-4 mr-2" />
					Back to Template
				</Button>

				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold">Add Problems to Template</h1>
						{/* <p className="text-muted-foreground mt-2">
							Template: {template.name}
						</p> */}
					</div>

					<div className="flex items-center gap-2">
						<span className="text-sm text-muted-foreground">
							{selectedIds.length} selected
						</span>
						<Button
							onClick={handleAddProblems}
							disabled={selectedIds.length === 0 || adding}
							className="ml-4"
						>
							{adding ? (
								<>
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									Adding...
								</>
							) : (
								<>
									<Plus className="h-4 w-4 mr-2" />
									Add Selected Problems
								</>
							)}
						</Button>
					</div>
				</div>
			</div>

			<ProblemSelector
				problems={problems || []}
				selected={selectedIds}
				setSelected={setSelectedIds}
			/>

			{error && (
				<Alert variant="destructive" className="mb-6">
					<AlertDescription>Error adding problems: {error}</AlertDescription>
				</Alert>
			)}
		</div>
	);
}
