import mongoose from "mongoose";

// types/problem.ts
export interface IPlatformLinks {
	leetcode?: string;
	gfg?: string;
	hackerrank?: string;
	codeforces?: string;
	custom?: string;
}

export interface IExample {
	input: string;
	output: string;
	explanation: string;
}

export interface IProblem extends Document {
	_id: mongoose.Types.ObjectId;
	title: string;
	slug: string;
	description: string;
	difficulty: "Easy" | "Medium" | "Hard";
	category: string;
	tags: string[];
	companies: string[];
	platformLinks: IPlatformLinks;
	editorial: string;
	hints: string[];
	constraints: string;
	examples: IExample[];
	totalAttempts: number;
	totalSolved: number;
	averageRating: number;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}
