import mongoose, { Schema } from "mongoose";
import { ITemplateDocument, ITemplateModel } from "@/types/template.type";

const templateProblemSchema = new Schema(
	{
		problemId: {
			type: Schema.Types.ObjectId,
			ref: "MasterProblem",
			required: true,
		},
		order: {
			type: Number,
			required: true,
			min: 1,
		},
		isRequired: {
			type: Boolean,
			default: true,
		},
		notes: {
			type: String,
			trim: true,
		},
	},
	{ _id: false }
);

const templateSchema = new Schema<ITemplateDocument>(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			maxlength: 100,
		},
		description: {
			type: String,
			trim: true,
			maxlength: 500,
		},
		author: {
			type: String,
			required: true,
			trim: true,
			maxlength: 50,
		},
		category: {
			type: String,
			required: true,
			trim: true,
			maxlength: 30,
		},
		difficulty: {
			type: String,
			required: true,
			enum: ["Easy", "Medium", "Hard"],
			trim: true,
		},
		problemCount: {
			type: Number,
			required: true,
			min: 0,
			validate: {
				validator: function (this: ITemplateDocument, value: number) {
					return value === this.problems.length;
				},
				message: "Problem count must match the number of problems in the array",
			},
		},
		problems: {
			type: [templateProblemSchema],
			default: [],
			validate: {
				validator: function (problems: any[]) {
					// Check for unique orders
					const orders = problems.map((p) => p.order);
					return orders.length === new Set(orders).size;
				},
				message: "Problem orders must be unique",
			},
		},
		isOfficial: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
	}
);

// Indexes for better query performance
templateSchema.index({ category: 1, difficulty: 1 });
templateSchema.index({ author: 1 });
templateSchema.index({ isOfficial: 1 });

// Pre-save middleware to ensure problemCount matches problems array length
templateSchema.pre("save", function (next) {
	this.problemCount = this.problems.length;
	next();
});

// Pre-update middleware for findOneAndUpdate operations
templateSchema.pre(["findOneAndUpdate", "updateOne"], function (next) {
	const update = this.getUpdate() as any;
	if (update.$set?.problems) {
		update.$set.problemCount = update.$set.problems.length;
	} else if (update.problems) {
		update.problemCount = update.problems.length;
	}
	next();
});

// Solution: Check if the model already exists before defining it
const Template =
	(mongoose.models.Template as ITemplateModel) ||
	mongoose.model<ITemplateDocument, ITemplateModel>("Template", templateSchema);

export default Template;
