// hooks/useTemplates.ts
import { useCallback, useEffect, useState } from "react";
import {
	fetchTemplates,
	fetchTemplateById,
	fetchTemplateCategories,
	searchTemplates,
	addProblemsToTemplate,
} from "@/lib/api/templates";
import { ITemplateDocument as Template } from "@/types/template.type";
import { IProblem } from "@/types/problem.type";

export function useTemplates() {
	const [templates, setTemplates] = useState<Template[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchTemplates()
			.then(setTemplates)
			.catch((err) => setError(err.message))
			.finally(() => setLoading(false));
	}, []);

	return { templates, loading, error };
}

export function useAddProblemsToTemplate(templateId: string) {
	const [adding, setAdding] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const addProblems = useCallback(
		async (
			problems: {
				problemId: string;
				order: number;
				isRequired?: boolean;
				notes?: string;
			}[]
		) => {
			setAdding(true);
			setError(null);

			try {
				const data = await addProblemsToTemplate(templateId, problems);
				// setTemplate(data);
			} catch (err: any) {
				setError(err.message);
			} finally {
				setAdding(false);
			}
		},
		[templateId]
	);

	return { addProblems, adding, error };
}

export function useTemplate(id: string) {
	const [template, setTemplate] = useState<Template | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!id) return;
		setLoading(true);
		fetchTemplateById(id)
			.then(setTemplate)
			.catch((err) => setError(err.message))
			.finally(() => setLoading(false));
	}, [id]);

	return { template, setTemplate, loading, error };
}

export function useTemplateCategories() {
	const [categories, setCategories] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchTemplateCategories()
			.then(setCategories)
			.catch((err) => setError(err.message))
			.finally(() => setLoading(false));
	}, []);

	return { categories, loading, error };
}

export function useTemplateSearch(query: string) {
	const [results, setResults] = useState<Template[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!query) return;

		setLoading(true);
		searchTemplates(query)
			.then(setResults)
			.catch((err) => setError(err.message))
			.finally(() => setLoading(false));
	}, [query]);

	return { results, loading, error };
}
