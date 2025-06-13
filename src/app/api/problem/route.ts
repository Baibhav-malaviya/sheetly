// app/api/problems/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose"; // You'll need to create this
import Problem from "@/models/Problem.model";
import { generateUniqueSlug } from "@/lib/generateSlug";

// GET /api/problems - List all problems
export async function GET(request: NextRequest) {
	try {
		await dbConnect;

		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get("page") || "1");
		const limit = parseInt(searchParams.get("limit") || "10");
		const difficulty = searchParams.get("difficulty");
		const category = searchParams.get("category");
		const tags = searchParams.get("tags");

		// Build filter object
		const filter: any = { isActive: true };

		if (difficulty) filter.difficulty = difficulty;
		if (category) filter.category = new RegExp(category, "i");
		if (tags) {
			const tagArray = tags.split(",").map((tag) => tag.trim());
			filter.tags = { $in: tagArray };
		}

		const skip = (page - 1) * limit;

		const problems = await Problem.find(filter)
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.select("-editorial -hints") // Exclude detailed fields for list view
			.lean();

		const total = await Problem.countDocuments(filter);

		return NextResponse.json({
			success: true,
			data: problems,
			pagination: {
				page,
				limit,
				total,
				pages: Math.ceil(total / limit),
			},
		});
	} catch (error: any) {
		console.error("GET /api/problems error:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to fetch problems" },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		await dbConnect;

		const body = await request.json();

		const requiredFields = ["title", "description", "difficulty", "category"];
		const missingFields = requiredFields.filter((field) => !body[field]);

		if (missingFields.length > 0) {
			return NextResponse.json(
				{
					success: false,
					error: `Missing required fields: ${missingFields.join(", ")}`,
				},
				{ status: 400 }
			);
		}

		// Auto-generate slug if not provided
		if (!body.slug) {
			body.slug = await generateUniqueSlug(body.title);
		} else {
			const existingProblem = await Problem.findOne({ slug: body.slug });
			if (existingProblem) {
				return NextResponse.json(
					{ success: false, error: "Problem with this slug already exists" },
					{ status: 409 }
				);
			}
		}

		const problem = new Problem(body);
		await problem.save();

		return NextResponse.json({ success: true, data: problem }, { status: 201 });
	} catch (error: any) {
		console.error("POST /api/problems error:", error);

		if (error.code === 11000) {
			return NextResponse.json(
				{ success: false, error: "Problem with this slug already exists" },
				{ status: 409 }
			);
		}

		return NextResponse.json(
			{ success: false, error: "Failed to create problem" },
			{ status: 500 }
		);
	}
}
