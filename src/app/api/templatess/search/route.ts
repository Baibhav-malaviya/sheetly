import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Template from "@/models/Template.model";

export async function GET(req: NextRequest) {
	try {
		await connectDB;
		const { searchParams } = new URL(req.url);
		const query = searchParams.get("q") || "";

		const templates = await Template.find({
			isOfficial: true,
			$or: [
				{ name: new RegExp(query, "i") },
				{ category: new RegExp(query, "i") },
			],
		}).limit(20);

		return NextResponse.json({ success: true, data: templates });
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: "Search failed" },
			{ status: 500 }
		);
	}
}
