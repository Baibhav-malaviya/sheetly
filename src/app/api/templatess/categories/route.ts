import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Template from "@/models/Template.model";

export async function GET(req: NextRequest) {
	try {
		await connectDB;
		const categories = await Template.distinct("category", {
			isOfficial: true,
		});
		return NextResponse.json({ success: true, data: categories });
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: "Failed to fetch categories" },
			{ status: 500 }
		);
	}
}
