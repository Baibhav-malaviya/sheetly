import { useEffect, useState, useCallback } from "react";
import {
	getAllProblems,
	getProblemById,
	createProblem,
	updateProblem,
	deleteProblem,
} from "@/lib/api/problems";
import { IProblem as Problem } from "@/types/problem.type";

export const useProblem = () => {
	const [problems, setProblems] = useState<Problem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Fetch all problems on initial mount
	const loadProblems = useCallback(async () => {
		try {
			setLoading(true);
			const data = await getAllProblems();
			setProblems(data);
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadProblems();
	}, [loadProblems]);

	// Function to fetch a single problem
	const fetchOne = async (id: string) => {
		try {
			setLoading(true);
			setError(null);
			return await getProblemById(id);
		} catch (err: any) {
			setError(err.message);
			return null;
		} finally {
			setLoading(false);
		}
	};

	// Function to create a new problem
	const create = async (data: Partial<Problem>) => {
		try {
			setLoading(true);
			setError(null);
			const newProblem = await createProblem(data);
			// Optimistically update the local state
			setProblems((prev) => [...prev, newProblem]);
			return newProblem;
		} catch (err: any) {
			setError(err.message);
			// Optionally, revert optimistic update on failure
			loadProblems(); // Refetch to get the correct state
			return null;
		} finally {
			setLoading(false);
		}
	};

	// Function to update an existing problem
	const update = async (id: string, data: Partial<Problem>) => {
		try {
			setLoading(true);
			setError(null);
			const updated = await updateProblem(id, data);
			// Optimistically update the local state
			setProblems((prev) =>
				prev.map((p) => (p._id.toString() === id ? updated : p))
			);
			return updated;
		} catch (err: any) {
			setError(err.message);
			loadProblems(); // Refetch to get the correct state
			return null;
		} finally {
			setLoading(false);
		}
	};

	// Function to remove a problem
	const remove = async (id: string) => {
		// Keep a copy of the original state in case of failure
		const originalProblems = [...problems];
		// Optimistically update the UI
		setProblems((prev) => prev.filter((p) => p._id.toString() !== id));
		try {
			setError(null);
			return await deleteProblem(id);
		} catch (err: any) {
			setError(err.message);
			// Revert to the original state on failure
			setProblems(originalProblems);
			return null;
		}
	};

	return {
		problems,
		loading,
		error,
		fetchOne,
		create,
		update,
		remove,
	};
};
