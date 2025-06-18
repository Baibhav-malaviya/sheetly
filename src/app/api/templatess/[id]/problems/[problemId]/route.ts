// app/api/templates/[id]/problems/[problemId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Template from "@/models/Template.model"; // Adjust path as needed
import { Types } from "mongoose";

interface RouteParams {
	id: string;
	problemId: string;
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<RouteParams> }
) {
	try {
		await connectDB;

		const { id: templateId, problemId } = await params;

		const updated = await Template.findByIdAndUpdate(
			templateId,
			{
				$pull: {
					problems: { problemId: new Types.ObjectId(problemId) },
				},
			},
			{ new: true }
		);

		if (!updated)
			return NextResponse.json(
				{ success: false, error: "Template not found" },
				{ status: 404 }
			);

		// Optional: update problemCount
		updated.problemCount = updated.problems.length;
		await updated.save();

		return NextResponse.json({ success: true, data: updated });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ success: false, error: "Server error" },
			{ status: 500 }
		);
	}
}
