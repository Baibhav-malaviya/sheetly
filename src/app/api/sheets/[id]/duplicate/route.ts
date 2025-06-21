// app/api/sheets/[id]/duplicate/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Sheet from "@/models/Sheet.model";
import { getSession } from "@/lib/auth";

import mongoose from "mongoose";

interface RouteParams {
	params: { id: string };
}

// POST /api/sheets/[id]/duplicate - Duplicate sheet
export async function POST(request: NextRequest, { params }: RouteParams) {
	try {
		const session = await getSession();
		if (!session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { id } = params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return NextResponse.json({ error: "Invalid sheet ID" }, { status: 400 });
		}

		await connectDB;

		const originalSheet = await Sheet.findById(id);

		if (!originalSheet) {
			return NextResponse.json({ error: "Sheet not found" }, { status: 404 });
		}

		// Check if sheet is public or user owns it
		if (
			!originalSheet.isPublic &&
			originalSheet.userId.toString() !== session.user.id
		) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		// Create duplicate with new user ID and reset social stats
		// Create duplicate with new user ID and reset social stats
		const { _id, createdAt, updatedAt, ...rest } = originalSheet.toObject();

		const duplicateSheet = new Sheet({
			...rest,
			userId: session.user.id,
			name: `${originalSheet.name} (Copy)`,
			social: {
				upvotes: 0,
				downvotes: 0,
				score: 0,
			},
		});

		await duplicateSheet.save();

		return NextResponse.json({ sheet: duplicateSheet }, { status: 201 });
	} catch (error) {
		console.error("Error duplicating sheet:", error);
		return NextResponse.json(
			{ error: "Failed to duplicate sheet" },
			{ status: 500 }
		);
	}
}
