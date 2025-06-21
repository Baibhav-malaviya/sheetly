import {
	ISheetProblem,
	ISettings,
	ISocial,
	SheetCategory,
	SheetDifficulty,
	ISheetDocument,
} from "@/types/sheet.type";
import { Types } from "mongoose"; // You might need this if you're dealing with ObjectIds directly in the API layer, though usually they are stringified.

// Derive CreateSheetData and UpdateSheetData from ISheet for consistency
export interface CreateSheetData {
	name: string;
	description?: string;
	category: SheetCategory;
	isTemplate?: boolean;
	isPublic?: boolean;
	problems?: ISheetProblem[]; // If problems can be added on creation
	settings?: ISettings;
	tags?: string[];
	difficulty: SheetDifficulty;
}

export interface UpdateSheetData {
	name?: string;
	description?: string;
	category?: SheetCategory;
	isTemplate?: boolean;
	isPublic?: boolean;
	problems?: ISheetProblem[];
	settings?: ISettings;
	tags?: string[];
	difficulty?: SheetDifficulty;
	social?: Partial<ISocial>; // Allow partial updates to social fields if needed
}

// Fetch user's sheets
export async function fetchUserSheets(): Promise<ISheetDocument[]> {
	const response = await fetch("/api/sheets", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		throw new Error(`Failed to fetch sheets: ${response.statusText}`);
	}

	const data = await response.json();
	return data.sheets;
}

// Fetch specific sheet
export async function fetchSheet(id: string): Promise<ISheetDocument> {
	const response = await fetch(`/api/sheets/${id}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		throw new Error(`Failed to fetch sheet: ${response.statusText}`);
	}

	const data = await response.json();
	return data.sheet;
}

// Create new sheet
export async function createSheet(
	sheetData: CreateSheetData
): Promise<ISheetDocument> {
	const response = await fetch("/api/sheets", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(sheetData),
	});

	if (!response.ok) {
		throw new Error(`Failed to create sheet: ${response.statusText}`);
	}

	const data = await response.json();
	return data.sheet;
}

// Update sheet
export async function updateSheet(
	id: string,
	updates: UpdateSheetData
): Promise<ISheetDocument> {
	const response = await fetch(`/api/sheets/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(updates),
	});

	if (!response.ok) {
		throw new Error(`Failed to update sheet: ${response.statusText}`);
	}

	const data = await response.json();
	return data.sheet;
}

// Delete sheet
export async function deleteSheet(id: string): Promise<void> {
	const response = await fetch(`/api/sheets/${id}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		throw new Error(`Failed to delete sheet: ${response.statusText}`);
	}
}

// Duplicate sheet
export async function duplicateSheet(id: string): Promise<ISheetDocument> {
	const response = await fetch(`/api/sheets/${id}/duplicate`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		throw new Error(`Failed to duplicate sheet: ${response.statusText}`);
	}

	const data = await response.json();
	return data.sheet;
}

// --- Social Interactions (Optional, but good to include based on your sheet.type.ts) ---

export async function upvoteSheet(id: string): Promise<ISheetDocument> {
	const response = await fetch(`/api/sheets/${id}/upvote`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		throw new Error(`Failed to upvote sheet: ${response.statusText}`);
	}

	const data = await response.json();
	return data.sheet;
}

export async function downvoteSheet(id: string): Promise<ISheetDocument> {
	const response = await fetch(`/api/sheets/${id}/downvote`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		throw new Error(`Failed to downvote sheet: ${response.statusText}`);
	}

	const data = await response.json();
	return data.sheet;
}

// You can add more specific API calls for other social interactions or problem updates within a sheet
// For example, updating a problem's status within a sheet:
export async function updateSheetProblemStatus(
	sheetId: string,
	problemId: Types.ObjectId, // Or string if your API expects string ID
	newStatus: string // Using string for ProblemStatus enum as it will be sent as a string
): Promise<ISheetDocument> {
	const response = await fetch(
		`/api/sheets/${sheetId}/problems/${problemId}/status`,
		{
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ status: newStatus }),
		}
	);

	if (!response.ok) {
		throw new Error(`Failed to update problem status: ${response.statusText}`);
	}

	const data = await response.json();
	return data.sheet;
}
