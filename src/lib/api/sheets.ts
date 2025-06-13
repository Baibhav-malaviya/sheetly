// lib/api/sheets.ts - API utility functions
export interface Sheet {
	_id: string;
	title: string;
	content: string;
	description?: string;
	tags?: string[];
	isPublic: boolean;
	userId: string;
	social: {
		upvotes: number;
		downvotes: number;
		score: number;
	};
	createdAt: string;
	updatedAt: string;
}

export interface CreateSheetData {
	title: string;
	content: string;
	description?: string;
	tags?: string[];
	isPublic?: boolean;
}

export interface UpdateSheetData {
	title?: string;
	content?: string;
	description?: string;
	tags?: string[];
	isPublic?: boolean;
}

// Fetch user's sheets
export async function fetchUserSheets(): Promise<Sheet[]> {
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
export async function fetchSheet(id: string): Promise<Sheet> {
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
export async function createSheet(sheetData: CreateSheetData): Promise<Sheet> {
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
): Promise<Sheet> {
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
export async function duplicateSheet(id: string): Promise<Sheet> {
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
