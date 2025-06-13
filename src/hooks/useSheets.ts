import { useState, useEffect } from "react";
import {
	Sheet,
	fetchUserSheets,
	createSheet,
	updateSheet,
	deleteSheet,
	duplicateSheet,
	CreateSheetData,
	UpdateSheetData,
	fetchSheet,
} from "@/lib/api/sheets";

export function useSheets() {
	const [sheets, setSheets] = useState<Sheet[]>([]);
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
			setSheets((prev) =>
				prev.map((sheet) => (sheet._id === id ? updatedSheet : sheet))
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
			setSheets((prev) => prev.filter((sheet) => sheet._id !== id));
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to delete sheet");
			throw err;
		}
	};

	const copySheet = async (id: string) => {
		try {
			const duplicatedSheet = await duplicateSheet(id);
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
	const [sheet, setSheet] = useState<Sheet | null>(null);
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
			const updatedSheet = await updateSheet(sheet._id, updates);
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
