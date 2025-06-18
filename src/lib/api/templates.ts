import { IProblem } from "@/types/problem.type";
import { ITemplateDocument as Template } from "@/types/template.type"; // adjust path as needed

const BASE_URL = "/api/templatess"; // ✅ also fixed typo: was "templates"

export async function fetchTemplates(): Promise<Template[]> {
	const res = await fetch(`${BASE_URL}`);
	if (!res.ok) throw new Error("Failed to fetch templates");

	const json = await res.json();
	return json.data;
}

export async function fetchTemplateById(id: string): Promise<Template> {
	const res = await fetch(`${BASE_URL}/${id}`);
	if (!res.ok) throw new Error("Template not found");

	const json = await res.json();
	return json.data;
}

export async function createSheetFromTemplate(
	id: string
): Promise<{ success: boolean; sheetId: string }> {
	const res = await fetch(`${BASE_URL}/${id}/create-sheet`, {
		method: "POST",
	});
	if (!res.ok) throw new Error("Failed to create sheet");

	return res.json(); // you can return as-is if backend returns correct format
}

export async function fetchTemplateCategories(): Promise<string[]> {
	const res = await fetch(`${BASE_URL}/categories`);
	if (!res.ok) throw new Error("Failed to fetch categories");

	const json = await res.json();
	return json.data;
}

export async function searchTemplates(query: string): Promise<Template[]> {
	const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`);
	if (!res.ok) throw new Error("Failed to search templates");

	const json = await res.json();
	return json.data;
}

export async function createTemplate(template: Partial<Template>) {
	const res = await fetch(`${BASE_URL}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(template),
	});

	if (!res.ok) throw new Error("Failed to create template");

	const json = await res.json();
	return json.data;
}

export async function removeProblemFromTemplate(
	templateId: string,
	problemId: string
) {
	const res = await fetch(`${BASE_URL}/${templateId}/problems/${problemId}`, {
		method: "DELETE",
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data.error || "Failed to remove problem");
	return data;
}

export async function addProblemsToTemplate(
	templateId: string,
	problems:
		| IProblem[]
		| {
				problemId: string;
				isRequired?: boolean;
				order: number;
				notes?: string;
		  }[]
) {
	const res = await fetch(`${BASE_URL}/${templateId}/problems`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ problems }),
	});

	if (!res.ok) {
		const errorData = await res.json();
		throw new Error(errorData?.error || "Failed to add problems");
	}

	const json = await res.json();
	return json.data;
}
