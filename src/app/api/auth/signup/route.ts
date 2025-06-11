import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import mongooseConnection from "@/lib/mongoose";
import User from "@/models/User.model";

export async function POST(req: Request) {
	try {
		const { email, password, name } = await req.json();

		if (!email || !password || !name) {
			return NextResponse.json(
				{ message: "All fields are required" },
				{ status: 400 }
			);
		}

		await mongooseConnection;

		const existingUser = await User.findOne({ email });

		if (existingUser) {
			return NextResponse.json(
				{ message: "User already exists" },
				{ status: 409 }
			);
		}

		const passwordHash = await bcrypt.hash(password, 10);

		const newUser = await User.create({
			email,
			passwordHash,
			profile: {
				name,
				avatar: "",
				timezone: "Asia/Kolkata",
				preferences: {
					defaultView: "list",
					notifications: true,
					theme: "light",
				},
			},
		});

		return NextResponse.json({ message: "User created", userId: newUser._id });
	} catch (error) {
		console.error("[SIGNUP_ERROR]", error);
		return NextResponse.json({ message: "Server error" }, { status: 500 });
	}
}
