import { NextRequest, NextResponse } from "next/server";
import Template from "@/models/Template.model";
import connectDB from "@/lib/mongoose";
import { Types } from "mongoose";
import Problem from "@/models/Problem.model";

interface RouteParams {
	id: string;
}

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<RouteParams> }
) {
	try {
		await connectDB;

		const { id } = await params;

		if (!Types.ObjectId.isValid(id)) {
			return NextResponse.json(
				{ success: false, error: "Invalid template ID" },
				{ status: 400 }
			);
		}

		// Find template and populate problem details
		const template = await Template.findById(id).lean();

		if (!template) {
			return NextResponse.json(
				{ success: false, error: "Template not found" },
				{ status: 404 }
			);
		}

		// Fetch all problems referenced in the template
		const problemIds = template.problems.map((p) => p.problemId);
		const problems = await Problem.find({ _id: { $in: problemIds } }).lean();

		// Create a map for quick lookup
		const problemMap = new Map(
			problems.map((problem) => [problem._id.toString(), problem])
		);

		// Populate the template problems with actual problem data
		const populatedProblems = template.problems.map((templateProblem) => ({
			...templateProblem,
			problem: problemMap.get(templateProblem.problemId.toString()) || null,
		}));

		// Sort problems by order
		populatedProblems.sort((a, b) => a.order - b.order);

		const populatedTemplate = {
			...template,
			problems: populatedProblems,
		};

		return NextResponse.json({ success: true, data: populatedTemplate });
	} catch (err) {
		console.error("Error fetching template:", err);
		return NextResponse.json(
			{ success: false, error: "Failed to fetch template" },
			{ status: 500 }
		);
	}
}
