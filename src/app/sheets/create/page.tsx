"use client";

import { useState } from "react";
import ProblemSelector from "@/components/templatess/ProblemSelector";
import SheetForm from "@/components/sheets/SheetForm";
import { useProblem } from "@/hooks/useProblem";
import { useAuth } from "@/hooks/useAuth";
import { UnauthorizedError } from "@/components/ErrorState";

export default function CreateSheetPage() {
	const { session } = useAuth();
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const { problems } = useProblem();

	if (!session) return <UnauthorizedError />;

	return (
		<div className="container mx-auto py-8 max-w-6xl">
			<h1 className="text-3xl font-bold mb-4">Create New Sheet</h1>

			<div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
				{/* Problem Selection */}
				<ProblemSelector
					problems={problems || []}
					selected={selectedIds}
					setSelected={setSelectedIds}
				/>

				{/* Sheet Config Form */}
				<SheetForm selectedProblemIds={selectedIds} />
			</div>
		</div>
	);
}
