// app/api/sheets/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Sheet from "@/models/Sheet.model";
import mongoose from "mongoose";
import { getSession } from "@/lib/auth";

interface RouteParams {
	params: { id: string };
}

// GET /api/sheets/[id] - Get specific sheet
export async function GET(request: NextRequest, { params }: RouteParams) {
	try {
		const { id } = params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return NextResponse.json({ error: "Invalid sheet ID" }, { status: 400 });
		}

		await connectDB;

		const sheet = await Sheet.findById(id).lean();

		if (!sheet) {
			return NextResponse.json({ error: "Sheet not found" }, { status: 404 });
		}

		return NextResponse.json({ sheet });
	} catch (error) {
		console.error("Error fetching sheet:", error);
		return NextResponse.json(
			{ error: "Failed to fetch sheet" },
			{ status: 500 }
		);
	}
}

// PUT /api/sheets/[id] - Update sheet
export async function PUT(request: NextRequest, { params }: RouteParams) {
	try {
		const session = await getSession();
		if (!session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { id } = params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return NextResponse.json({ error: "Invalid sheet ID" }, { status: 400 });
		}

		const body = await request.json();
		await connectDB;

		const sheet = await Sheet.findById(id);

		if (!sheet) {
			return NextResponse.json({ error: "Sheet not found" }, { status: 404 });
		}

		// Check if user owns the sheet
		if (sheet.userId.toString() !== session.user.id) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		// Update sheet fields (exclude sensitive fields)
		const allowedUpdates = [
			"title",
			"content",
			"description",
			"tags",
			"isPublic",
		] as const;
		allowedUpdates.forEach((field) => {
			if (body[field] !== undefined) {
				(sheet as any)[field] = body[field];
			}
		});

		sheet.updatedAt = new Date();
		await sheet.save();

		return NextResponse.json({ sheet });
	} catch (error) {
		console.error("Error updating sheet:", error);
		return NextResponse.json(
			{ error: "Failed to update sheet" },
			{ status: 500 }
		);
	}
}

// DELETE /api/sheets/[id] - Delete sheet
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

		const sheet = await Sheet.findById(id);

		if (!sheet) {
			return NextResponse.json({ error: "Sheet not found" }, { status: 404 });
		}

		// Check if user owns the sheet
		if (sheet.userId.toString() !== session.user.id) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		await Sheet.findByIdAndDelete(id);

		return NextResponse.json({ message: "Sheet deleted successfully" });
	} catch (error) {
		console.error("Error deleting sheet:", error);
		return NextResponse.json(
			{ error: "Failed to delete sheet" },
			{ status: 500 }
		);
	}
}
