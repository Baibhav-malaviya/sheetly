// app/api/sheets/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose"; // Adjust path as needed
import Sheet from "@/models/Sheet.model"; // Adjust path as needed
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

// GET /api/sheets - Get user's personal sheets
export async function GET(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		await connectDB;

		const sheets = await Sheet.find({ userId: session.user.id })
			.sort({ createdAt: -1 })
			.lean();

		return NextResponse.json({ sheets });
	} catch (error) {
		console.error("Error fetching sheets:", error);
		return NextResponse.json(
			{ error: "Failed to fetch sheets" },
			{ status: 500 }
		);
	}
}

// POST /api/sheets - Create new sheet
export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		await connectDB;

		const sheet = new Sheet({
			...body,
			userId: session.user.id,
			social: {
				upvotes: 0,
				downvotes: 0,
				score: 0,
			},
		});

		await sheet.save();
		return NextResponse.json({ sheet }, { status: 201 });
	} catch (error) {
		console.error("Error creating sheet:", error);
		return NextResponse.json(
			{ error: "Failed to create sheet" },
			{ status: 500 }
		);
	}
}
