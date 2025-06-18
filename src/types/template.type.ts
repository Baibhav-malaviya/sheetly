import type { Types, Document, Model } from "mongoose";
import { IProblem } from "./problem.type";

export interface ITemplateProblem {
	problemId: Types.ObjectId | string;
	order: number;
	isRequired: boolean;
	notes?: string;
	// Populated problem data
	problem?: IProblem;
}

export interface ITemplate {
	name: string;
	description?: string;
	author: string;
	category: string;
	difficulty: string;
	problemCount: number;
	problems: ITemplateProblem[];
	isOfficial: boolean;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface ITemplateDocument extends ITemplate, Document {}

export interface ITemplateModel extends Model<ITemplateDocument> {}

// Extended interface for populated template
export interface ITemplateWithProblems extends Omit<ITemplate, "problems"> {
	problems: (ITemplateProblem & { problem: IProblem })[];
}
