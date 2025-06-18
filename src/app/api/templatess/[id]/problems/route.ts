import { NextRequest, NextResponse } from "next/server";
import Template from "@/models/Template.model";
import connectDB from "@/lib/mongoose";
import { Types } from "mongoose";

interface RouteParams {
	id: string;
}

export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<RouteParams> }
) {
	try {
		console.log("WELCOME");
		await connectDB;

		console.log("WELCOME");

		const { id: templateId } = await params;
		const body = await req.json();

		const { problems } = body;

		console.log("problem in route: ", problems);

		if (!Array.isArray(problems) || problems.length === 0) {
			return NextResponse.json(
				{ success: false, error: "Problems array is required" },
				{ status: 400 }
			);
		}

		const template = await Template.findById(templateId);
		if (!template) {
			return NextResponse.json(
				{ success: false, error: "Template not found" },
				{ status: 404 }
			);
		}

		const existingIds = new Set(
			template.problems.map((p) => p.problemId.toString())
		);

		const newProblems = problems
			.filter((p) => {
				return (
					p.problemId &&
					typeof p.order === "number" &&
					!existingIds.has(p.problemId)
				);
			})
			.map((p) => ({
				problemId: new Types.ObjectId(p.problemId),
				order: p.order,
				isRequired: p.isRequired ?? true,
				notes: p.notes ?? "",
			}));

		if (newProblems.length === 0) {
			return NextResponse.json(
				{ success: false, error: "No valid new problems to add" },
				{ status: 409 }
			);
		}

		template.problems.push(...newProblems);
		template.problemCount = template.problems.length;

		await template.save();

		return NextResponse.json({ success: true, data: template });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ success: false, error: "Server error" },
			{ status: 500 }
		);
	}
}
