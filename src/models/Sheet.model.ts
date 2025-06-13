// Simplified Sheet model with essential methods, virtuals, and statics retained
import mongoose, { Schema, Types, Document, Model } from "mongoose";

// Enums
export enum SheetCategory {
	PERSONAL = "Personal",
	TEMPLATE = "Template",
	STUDY = "Study",
	OTHER = "Other",
}

export enum SheetDifficulty {
	EASY = "Easy",
	MEDIUM = "Medium",
	HARD = "Hard",
}

// Interfaces
export interface IGoals {
	dailyTarget?: number;
	completionDeadline?: Date;
}

export interface IPreferences {
	showDifficulty: boolean;
}

export interface ISettings {
	goals: IGoals;
	preferences: IPreferences;
}

export interface ISocial {
	upvotes: number;
	downvotes: number;
	views: number;
	score: number;
}

export interface ISheet {
	userId: Types.ObjectId;
	name: string;
	category: SheetCategory;
	isTemplate: boolean;
	isPublic: boolean;
	settings: ISettings;
	social: ISocial;
	tags: string[];
	difficulty: SheetDifficulty;
	createdAt: Date;
	updatedAt: Date;
}

export interface ISheetDocument extends ISheet, Document {
	popularityScore: number;
	isDeadlineApproaching: boolean;

	incrementViews(): Promise<ISheetDocument>;
	addUpvote(): Promise<ISheetDocument>;
	updateGoals(goals: Partial<IGoals>): Promise<ISheetDocument>;
}

export interface ISheetModel extends Model<ISheetDocument> {
	findPopular(limit?: number): Promise<ISheetDocument[]>;
	getTrendingTags(limit?: number): Promise<{ _id: string; count: number }[]>;
}

const sheetSchema = new Schema<ISheetDocument>(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		name: { type: String, required: true },
		category: {
			type: String,
			enum: Object.values(SheetCategory),
			default: SheetCategory.PERSONAL,
		},
		isTemplate: { type: Boolean, default: false },
		isPublic: { type: Boolean, default: false },
		settings: {
			goals: {
				dailyTarget: { type: Number, min: 0 },
				completionDeadline: { type: Date },
			},
			preferences: {
				showDifficulty: { type: Boolean, default: true },
			},
		},
		social: {
			upvotes: { type: Number, default: 0 },
			downvotes: { type: Number, default: 0 },
			views: { type: Number, default: 0 },
			score: { type: Number, default: 0 },
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
		if (!this.settings.goals.completionDeadline) return false;
		const diff =
			(this.settings.goals.completionDeadline.getTime() - Date.now()) /
			(1000 * 60 * 60 * 24);
		return diff <= 7 && diff > 0;
	});

// Methods
sheetSchema.methods.incrementViews = function () {
	this.social.views++;
	return this.save();
};

sheetSchema.methods.addUpvote = function (): Promise<ISheetDocument> {
	this.social.upvotes += 1;
	this._recalculateScore();
	return this.save();
};

sheetSchema.methods.removeUpvote = function (): Promise<ISheetDocument> {
	this.social.upvotes = Math.max(0, this.social.upvotes - 1);
	this._recalculateScore();
	return this.save();
};

sheetSchema.methods.addDownvote = function (): Promise<ISheetDocument> {
	this.social.downvotes += 1;
	this._recalculateScore();
	return this.save();
};

sheetSchema.methods.removeDownvote = function (): Promise<ISheetDocument> {
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

// Middleware
sheetSchema.pre("save", function (next) {
	this.tags = [...new Set(this.tags.map((tag) => tag.toLowerCase()))];
	this.social.score = this.social.upvotes - this.social.downvotes;
	next();
});

const Sheet = mongoose.model<ISheetDocument, ISheetModel>("Sheet", sheetSchema);

export default Sheet;
