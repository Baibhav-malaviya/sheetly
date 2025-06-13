// models/Problem.ts
import mongoose, { Schema, Document, Model } from "mongoose";
import { IProblem } from "@/types/problem";

// Schema definition
const ProblemSchema = new Schema<IProblem>(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		slug: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
		},
		description: {
			type: String,
			required: true,
		},
		difficulty: {
			type: String,
			required: true,
			enum: ["Easy", "Medium", "Hard"],
		},
		category: {
			type: String,
			required: true,
			trim: true,
		},
		tags: [
			{
				type: String,
				trim: true,
			},
		],
		companies: [
			{
				type: String,
				trim: true,
			},
		],
		platformLinks: {
			leetcode: {
				type: String,
				trim: true,
			},
			gfg: {
				type: String,
				trim: true,
			},
			hackerrank: {
				type: String,
				trim: true,
			},
			codeforces: {
				type: String,
				trim: true,
			},
			custom: {
				type: String,
				trim: true,
			},
		},
		editorial: {
			type: String,
			trim: true,
		},
		hints: [
			{
				type: String,
				trim: true,
			},
		],
		constraints: {
			type: String,
			trim: true,
		},
		examples: [
			{
				input: {
					type: String,
					required: true,
				},
				output: {
					type: String,
					required: true,
				},
				explanation: {
					type: String,
					required: true,
				},
			},
		],
		totalAttempts: {
			type: Number,
			default: 0,
			min: 0,
		},
		totalSolved: {
			type: Number,
			default: 0,
			min: 0,
		},
		averageRating: {
			type: Number,
			default: 0,
			min: 0,
			max: 5,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true, // This automatically adds createdAt and updatedAt
		collection: "Problems",
	}
);

// Index for better query performance
ProblemSchema.index({ difficulty: 1 });
ProblemSchema.index({ category: 1 });
ProblemSchema.index({ tags: 1 });
ProblemSchema.index({ isActive: 1 });

// Pre-save middleware to generate slug if not provided
ProblemSchema.pre("save", function (next) {
	if (!this.slug && this.title) {
		this.slug = this.title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "");
	}
	next();
});

// Create and export the model
const Problem: Model<IProblem> =
	mongoose.models.Problem || mongoose.model<IProblem>("Problem", ProblemSchema);

export default Problem;
