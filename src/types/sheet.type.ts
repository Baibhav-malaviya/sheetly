import { Types, Document, Model } from "mongoose";

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

export enum ProblemStatus {
	NOT_STARTED = "Not Started",
	IN_PROGRESS = "In Progress",
	SOLVED = "Solved",
	REVISIT = "Revisit",
}

// Interfaces
export interface ISheetProblem {
	problemId: Types.ObjectId;
	order: number;
	addedAt: Date;

	status: ProblemStatus;
	completed: boolean;
	completedAt?: Date;
	timeSpent: number;
	attempts: number;
	personalRating?: number;
	notes?: string;
	approaches: string[];
	firstAttemptDate?: Date;
	lastAttemptDate?: Date;
	bookmarked: boolean;
}

export interface IGoals {
	dailyTarget?: number;
	weeklyHours?: number;
	completionDeadline?: Date;
}

export interface IPreferences {
	showDifficulty: boolean;
	showTime: boolean;
	showNotes: boolean;
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
	comments: number;
	usedAsTemplate: number;
}

export interface ISheet {
	userId: Types.ObjectId;
	name: string;
	description?: string;
	category: SheetCategory;
	isTemplate: boolean;
	isPublic: boolean;
	problems: ISheetProblem[];
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
	removeUpvote(): Promise<ISheetDocument>;
	addDownvote(): Promise<ISheetDocument>;
	removeDownvote(): Promise<ISheetDocument>;
	updateGoals(goals: Partial<IGoals>): Promise<ISheetDocument>;
	_recalculateScore(): void; // ← Add this line
}

export interface ISheetModel extends Model<ISheetDocument> {
	findPopular(limit?: number): Promise<ISheetDocument[]>;
	getTrendingTags(limit?: number): Promise<{ _id: string; count: number }[]>;
}
