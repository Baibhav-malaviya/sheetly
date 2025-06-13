import type { IProblem as Problem } from "@/types/problem";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

interface ProblemRowProps {
	problem: Problem;
	onEdit: (problem: Problem) => void;
	onDelete: (id: string) => void;
}

export default function ProblemRow({
	problem,
	onEdit,
	onDelete,
}: ProblemRowProps) {
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
		<TableRow>
			<TableCell className="font-medium">
				<Link href={`problems/${problem._id}`}>{problem.title}</Link>
			</TableCell>
			<TableCell>
				<Badge className={getDifficultyColor(problem.difficulty)}>
					{problem.difficulty}
				</Badge>
			</TableCell>
			<TableCell>{problem.category}</TableCell>
			<TableCell className="text-right">
				<div className="flex justify-end gap-2">
					<Button size="sm" variant="outline" onClick={() => onEdit(problem)}>
						<Pencil className="h-4 w-4" />
					</Button>
					<Button
						size="sm"
						variant="destructive"
						onClick={() => onDelete(problem._id.toString())}
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>
			</TableCell>
		</TableRow>
	);
}
