import { IProblem as Problem } from "@/types/problem";

const API_BASE = "/api/problem";

/**
 * Fetches all problems from the API.
 */
export const getAllProblems = async (): Promise<Problem[]> => {
	const res = await fetch(API_BASE, { method: "GET" });
	if (!res.ok) throw new Error("Failed to fetch problems");
	// The response is { data: [...] }, so we destructure 'data'.
	const { data } = await res.json();
	return data;
};

/**
 * Fetches a single problem by its ID.
 */
export const getProblemById = async (id: string): Promise<Problem> => {
	const res = await fetch(`${API_BASE}/${id}`, { method: "GET" });
	if (!res.ok) throw new Error("Problem not found");
	// The response is { data: {...} }, so we destructure 'data'.
	const { data } = await res.json();
	console.log(data);
	return data;
};

/**
 * Creates a new problem.
 */
export const createProblem = async (
	problemData: Partial<Problem>
): Promise<Problem> => {
	const res = await fetch(API_BASE, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(problemData),
	});
	if (!res.ok) {
		const errorData = await res.json();
		throw new Error(errorData.message || "Failed to create problem");
	}
	// The successful response is { data: {...} }, so we destructure 'data'.
	const { data } = await res.json();
	return data;
};

/**
 * Updates an existing problem.
 */
export const updateProblem = async (
	id: string,
	problemData: Partial<Problem>
): Promise<Problem> => {
	const res = await fetch(`${API_BASE}/${id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(problemData),
	});
	if (!res.ok) {
		const errorData = await res.json();
		throw new Error(errorData.message || "Failed to update problem");
	}
	// The successful response is { data: {...} }, so we destructure 'data'.
	const { data } = await res.json();
	return data;
};

/**
 * Deletes a problem by its ID.
 */
export const deleteProblem = async (
	id: string
): Promise<{ message: string }> => {
	const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
	if (!res.ok) {
		const errorData = await res.json();
		throw new Error(errorData.message || "Failed to delete problem");
	}
	// The successful response is { data: { message: "..." } }.
	const { data } = await res.json();
	return data;
};
