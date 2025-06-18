// models/User.ts
import { Schema, Document, model, models } from "mongoose";

export interface UserDocument extends Document {
	// Core authentication fields (Required for NextAuth)
	email: string;
	emailVerified?: Date | null;
	username?: string;
	passwordHash?: string;

	// Profile information
	profile: {
		name?: string;
		avatar?: string;
		timezone?: string;
		preferences?: {
			defaultView?: string;
			notifications?: boolean;
			theme?: string;
		};
	};

	// Basic auth metadata
	role: "user" | "admin" | "moderator";
	lastLogin?: Date;
	isActive: boolean;

	// Application-specific fields
	reputation: number;
	socialSettings: Record<string, any>;
	publicProfile: Record<string, any>;

	// Metadata
	createdAt: Date;
	updatedAt: Date;
}

const UserSchema = new Schema<UserDocument>(
	{
		// Core authentication fields (Required for NextAuth)
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		emailVerified: {
			type: Date,
			default: null,
		},
		username: {
			type: String,
			unique: true,
			sparse: true,
			trim: true,
		},
		passwordHash: { type: String },

		// Profile information
		profile: {
			name: { type: String },
			avatar: { type: String },
			timezone: { type: String },
			preferences: {
				defaultView: { type: String },
				notifications: { type: Boolean },
				theme: { type: String },
			},
		},

		// Basic auth metadata
		role: {
			type: String,
			enum: ["user", "admin", "moderator"],
			default: "user",
		},
		lastLogin: { type: Date },
		isActive: {
			type: Boolean,
			default: true,
		},

		// Application-specific fields
		reputation: {
			type: Number,
			default: 0,
		},
		socialSettings: {
			type: Object,
			default: {},
		},
		publicProfile: {
			type: Object,
			default: {},
		},
	},
	{ timestamps: true }
);

// Basic methods
UserSchema.methods.updateLastLogin = function () {
	this.lastLogin = new Date();
	return this.save();
};

UserSchema.methods.isEmailVerified = function () {
	return !!this.emailVerified;
};

// Static methods
UserSchema.statics.findByEmail = function (email: string) {
	return this.findOne({ email: email.toLowerCase() });
};

export default models.User || model<UserDocument>("User", UserSchema);
