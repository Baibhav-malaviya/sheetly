import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Template from "@/models/Template.model";
import Sheet from "@/models/Sheet.model";
import { Types } from "mongoose";
import { getSession } from "@/lib/auth";

export async function POST(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		await connectDB;
		const session = await getSession();
		if (!session?.user?.id) {
			return NextResponse.json(
				{ success: false, error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const { id: templateId } = params;

		const template = await Template.findById(templateId);
		if (!template) {
			return NextResponse.json(
				{ success: false, error: "Template not found" },
				{ status: 404 }
			);
		}

		const problems = template.problems.map((p) => ({
			problemId: p.problemId,
			order: p.order,
			addedAt: new Date(),
			status: "Not Started",
			completed: false,
			timeSpent: 0,
			attempts: 0,
			bookmarked: false,
		}));

		const newSheet = await Sheet.create({
			userId: new Types.ObjectId(session.user.id),
			name: template.name,
			description: template.description,
			category: "Template",
			isTemplate: false,
			isPublic: false,
			problems,
			tags: [template.category.toLowerCase()],
			difficulty: template.difficulty,
		});

		return NextResponse.json({ success: true, data: newSheet });
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: "Sheet creation failed" },
			{ status: 500 }
		);
	}
}
