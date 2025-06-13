// app/api/problems/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Problem from "@/models/Problem.model";
import mongoose from "mongoose";

interface RouteParams {
	params: {
		id: string;
	};
}

// GET /api/problems/[id] - Get specific problem
export async function GET(request: NextRequest, { params }: RouteParams) {
	try {
		await dbConnect;
		const { id } = await params;
		console.log("params: ", id);

		//Check if it's a valid ObjectId or use as slug
		let problem;
		if (mongoose.Types.ObjectId.isValid(id)) {
			problem = await Problem.findById(id);
		} else {
			problem = await Problem.findOne({ slug: id, isActive: true });
		}

		if (!problem) {
			return NextResponse.json(
				{ success: false, error: "Problem not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			data: problem,
		});
	} catch (error: any) {
		console.error(`GET /api/problems/${params.id} error:`, error);
		return NextResponse.json(
			{ success: false, error: "Failed to fetch problem" },
			{ status: 500 }
		);
	}
}

// DELETE /api/problems/[id] - Delete specific problem
export async function DELETE(request: NextRequest, { params }: RouteParams) {
	try {
		await dbConnect;

		const { id } = params;

		// Check if it's a valid ObjectId
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return NextResponse.json(
				{ success: false, error: "Invalid problem ID" },
				{ status: 400 }
			);
		}

		const problem = await Problem.findByIdAndDelete(id);

		if (!problem) {
			return NextResponse.json(
				{ success: false, error: "Problem not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			message: "Problem deleted successfully",
			data: problem,
		});
	} catch (error: any) {
		console.error(`DELETE /api/problems/${params.id} error:`, error);
		return NextResponse.json(
			{ success: false, error: "Failed to delete problem" },
			{ status: 500 }
		);
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	// Connect to the database
	await dbConnect;

	// Extract the problem ID from the URL parameters
	const { id } = params;

	// Ensure the ID is a string (though Next.js usually handles this for dynamic routes)
	if (typeof id !== "string") {
		return NextResponse.json(
			{ success: false, message: "Invalid Problem ID" },
			{ status: 400 }
		);
	}

	try {
		// Parse the request body as JSON
		const body = await request.json();

		// Find the problem by ID and update it with the request body
		// The `new: true` option returns the updated document
		// The `runValidators: true` option runs schema validators on update
		const updatedProblem = await Problem.findByIdAndUpdate(id, body, {
			new: true,
			runValidators: true,
		});

		// If no problem is found with the given ID, return 404
		if (!updatedProblem) {
			return NextResponse.json(
				{ success: false, message: "Problem not found" },
				{ status: 404 }
			);
		}

		// Return the updated problem
		return NextResponse.json(
			{ success: true, data: updatedProblem },
			{ status: 200 }
		);
	} catch (error: any) {
		// Handle Mongoose validation errors (e.g., if required fields are missing or enum is invalid)
		if (error.name === "ValidationError") {
			const messages = Object.values(error.errors).map(
				(err: any) => err.message
			);
			return NextResponse.json(
				{ success: false, message: messages.join(", ") },
				{ status: 400 }
			);
		}
		// Handle other potential errors (e.g., database connection issues)
		return NextResponse.json(
			{ success: false, message: "Server Error", error: error.message },
			{ status: 500 }
		);
	}
}
