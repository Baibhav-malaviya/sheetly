import mongoose, { Schema } from "mongoose";
import {
	ISheetDocument,
	ISheetModel,
	SheetCategory,
	SheetDifficulty,
	ProblemStatus,
	ISheetProblem,
	IGoals,
} from "@/types/sheet.type";

// Schema
const sheetProblemSchema = new Schema<ISheetProblem>(
	{
		problemId: {
			type: Schema.Types.ObjectId,
			ref: "MasterProblem",
			required: true,
		},
		order: Number,
		addedAt: { type: Date, default: Date.now },

		status: {
			type: String,
			enum: Object.values(ProblemStatus),
			default: ProblemStatus.NOT_STARTED,
		},
		completed: { type: Boolean, default: false },
		completedAt: Date,
		timeSpent: { type: Number, default: 0 },
		attempts: { type: Number, default: 0 },
		personalRating: Number,
		notes: String,
		approaches: [String],
		firstAttemptDate: Date,
		lastAttemptDate: Date,
		bookmarked: { type: Boolean, default: false },
	},
	{ _id: false }
);

const sheetSchema = new Schema<ISheetDocument>(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		name: { type: String, required: true },
		description: String,
		category: {
			type: String,
			enum: Object.values(SheetCategory),
			default: SheetCategory.PERSONAL,
		},
		isTemplate: { type: Boolean, default: false },
		isPublic: { type: Boolean, default: false },
		problems: [sheetProblemSchema],
		settings: {
			goals: {
				dailyTarget: Number,
				weeklyHours: Number,
				completionDeadline: Date,
			},
			preferences: {
				showDifficulty: { type: Boolean, default: true },
				showTime: { type: Boolean, default: true },
				showNotes: { type: Boolean, default: true },
			},
		},
		social: {
			upvotes: { type: Number, default: 0 },
			downvotes: { type: Number, default: 0 },
			views: { type: Number, default: 0 },
			score: { type: Number, default: 0 },
			comments: { type: Number, default: 0 },
			usedAsTemplate: { type: Number, default: 0 },
		},
		tags: [{ type: String, trim: true, lowercase: true }],
		difficulty: {
			type: String,
			enum: Object.values(SheetDifficulty),
			default: SheetDifficulty.MEDIUM,
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// Virtuals
sheetSchema.virtual("popularityScore").get(function (this: ISheetDocument) {
	return this.social.upvotes - this.social.downvotes + this.social.views * 0.1;
});

sheetSchema
	.virtual("isDeadlineApproaching")
	.get(function (this: ISheetDocument) {
		const deadline = this.settings.goals?.completionDeadline;
		if (!deadline) return false;
		const daysLeft = (deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
		return daysLeft <= 7 && daysLeft > 0;
	});

// Private helper
sheetSchema.methods._recalculateScore = function (this: ISheetDocument) {
	this.social.score = this.social.upvotes - this.social.downvotes;
};

// Instance Methods
sheetSchema.methods.incrementViews = function () {
	this.social.views++;
	return this.save();
};

sheetSchema.methods.addUpvote = function () {
	this.social.upvotes += 1;
	this._recalculateScore();
	return this.save();
};

sheetSchema.methods.removeUpvote = function () {
	this.social.upvotes = Math.max(0, this.social.upvotes - 1);
	this._recalculateScore();
	return this.save();
};

sheetSchema.methods.addDownvote = function () {
	this.social.downvotes += 1;
	this._recalculateScore();
	return this.save();
};

sheetSchema.methods.removeDownvote = function () {
	this.social.downvotes = Math.max(0, this.social.downvotes - 1);
	this._recalculateScore();
	return this.save();
};

sheetSchema.methods.updateGoals = function (goals: Partial<IGoals>) {
	this.settings.goals = { ...this.settings.goals, ...goals };
	return this.save();
};

// Statics
sheetSchema.statics.findPopular = function (limit = 10) {
	return this.find({ isPublic: true })
		.sort({ "social.score": -1, views: -1 })
		.limit(limit);
};

sheetSchema.statics.getTrendingTags = function (limit = 5) {
	return this.aggregate([
		{ $match: { isPublic: true } },
		{ $unwind: "$tags" },
		{ $group: { _id: "$tags", count: { $sum: 1 } } },
		{ $sort: { count: -1 } },
		{ $limit: limit },
	]);
};

// Pre-save middleware
sheetSchema.pre("save", function (next) {
	this.tags = [...new Set(this.tags.map((tag) => tag.toLowerCase().trim()))];
	this._recalculateScore();
	next();
});

const Sheet =
	(mongoose.models.Sheet as ISheetModel) ||
	mongoose.model<ISheetDocument, ISheetModel>("Sheet", sheetSchema);
export default Sheet;
