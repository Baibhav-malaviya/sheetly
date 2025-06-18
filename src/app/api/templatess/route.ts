import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Template from "@/models/Template.model";
import { ITemplate } from "@/types/template.type";

export async function GET(req: NextRequest) {
	try {
		await connectDB;
		const templates = await Template.find({ isOfficial: true }).sort({
			createdAt: -1,
		}); //!todo only for official templates
		console.log("templates: ", templates);
		return NextResponse.json({ success: true, data: templates });
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ success: false, error: "Failed to fetch templates" },
			{ status: 500 }
		);
	}
}

export async function POST(req: NextRequest) {
	try {
		await connectDB;

		const body: ITemplate = await req.json();

		// Basic validation
		const requiredFields = [
			"name",
			"author",
			"category",
			"difficulty",
			"problems",
		];
		const missingFields = requiredFields.filter(
			(field) => !(body as any)[field]
		);

		if (missingFields.length > 0) {
			return NextResponse.json(
				{
					success: false,
					error: `Missing fields: ${missingFields.join(", ")}`,
				},
				{ status: 400 }
			);
		}

		// Ensure problemCount matches
		body.problemCount = body.problems.length;

		const template = await Template.create(body);

		return NextResponse.json({ success: true, template }, { status: 201 });
	} catch (error: any) {
		console.error("Error creating template:", error);
		return NextResponse.json(
			{ success: false, error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
