import { useState, useEffect } from "react";
import {
	fetchUserSheets,
	createSheet,
	updateSheet,
	deleteSheet,
	duplicateSheet,
	CreateSheetData,
	UpdateSheetData,
	fetchSheet,
} from "@/lib/api/sheets";

import { ISheetDocument } from "@/types/sheet.type";

export function useSheets() {
	const [sheets, setSheets] = useState<ISheetDocument[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const loadSheets = async () => {
		try {
			setLoading(true);
			setError(null);
			const userSheets = await fetchUserSheets();
			setSheets(userSheets);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load sheets");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadSheets();
	}, []);

	const addSheet = async (sheetData: CreateSheetData) => {
		try {
			const newSheet = await createSheet(sheetData);
			setSheets((prev) => [newSheet, ...prev]);
			return newSheet;
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to create sheet");
			throw err;
		}
	};

	const editSheet = async (id: string, updates: UpdateSheetData) => {
		try {
			const updatedSheet = await updateSheet(id, updates);
			console.log("updatedSheet", updateSheet);
			setSheets((prev) =>
				prev.map((sheet) =>
					sheet._id.toString() === id ? updatedSheet : sheet
				)
			);
			return updatedSheet;
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to update sheet");
			throw err;
		}
	};

	const removeSheet = async (id: string) => {
		try {
			await deleteSheet(id);
			setSheets((prev) =>
				prev.filter((sheet) => sheet._id.toString() !== id.toString())
			);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to delete sheet");
			throw err;
		}
	};

	const copySheet = async (id: string) => {
		try {
			const duplicatedSheet = await duplicateSheet(id);
			// Optional: fetch full sheet if needed
			setSheets((prev) => [duplicatedSheet, ...prev]);
			return duplicatedSheet;
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to duplicate sheet"
			);
			throw err;
		}
	};

	return {
		sheets,
		loading,
		error,
		loadSheets,
		addSheet,
		editSheet,
		removeSheet,
		copySheet,
	};
}

export function useSheet(id: string) {
	const [sheet, setSheet] = useState<ISheetDocument | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadSheet = async () => {
			try {
				setLoading(true);
				setError(null);
				const fetchedSheet = await fetchSheet(id);
				setSheet(fetchedSheet);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Failed to load sheet");
			} finally {
				setLoading(false);
			}
		};

		if (id) {
			loadSheet();
		}
	}, [id]);

	const updateSheetData = async (updates: UpdateSheetData) => {
		if (!sheet) return;

		try {
			const updatedSheet = await updateSheet(id, updates);
			setSheet(updatedSheet);
			return updatedSheet;
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to update sheet");
			throw err;
		}
	};

	return {
		sheet,
		loading,
		error,
		updateSheet: updateSheetData,
	};
}
