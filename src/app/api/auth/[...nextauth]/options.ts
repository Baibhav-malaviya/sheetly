// lib/auth/options.ts

import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import bcrypt from "bcryptjs";
import User from "@/models/User.model";
import connectDB from "@/lib/mongoose";
import clientPromise from "@/lib/mongodb";

export const authOptions: NextAuthOptions = {
	adapter: MongoDBAdapter(clientPromise),

	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			authorization: {
				params: {
					prompt: "consent",
					access_type: "offline",
					response_type: "code",
				},
			},
		}),
		GitHubProvider({
			clientId: process.env.GITHUB_ID!,
			clientSecret: process.env.GITHUB_SECRET!,
		}),
		CredentialsProvider({
			id: "credentials",
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					throw new Error("Email and password are required");
				}

				await connectDB;

				const user = await User.findOne({
					email: credentials.email.toLowerCase(),
				});

				if (!user) throw new Error("No user found with this email");
				if (!user.passwordHash)
					throw new Error("Please sign in with your social account");

				const isValid = await bcrypt.compare(
					credentials.password,
					user.passwordHash
				);
				if (!isValid) throw new Error("Invalid email or password");

				if (!user.isActive)
					throw new Error("Account is deactivated. Please contact support");

				user.lastLogin = new Date();
				await user.save();

				return user;
			},
		}),
	],

	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				await connectDB;
				const dbUser = await User.findOne({ email: user.email });

				if (dbUser) {
					token.id = dbUser._id.toString();
					token.email = dbUser.email;
					token.username = dbUser.username;
					token.role = dbUser.role;
					token.isActive = dbUser.isActive;
					token.reputation = dbUser.reputation;
					token.profile = dbUser.profile;
					token.lastLogin = dbUser.lastLogin;
					token.emailVerified = dbUser.emailVerified;
				}
			}
			return token;
		},

		async session({ session, token }) {
			if (token && session.user) {
				session.user.id = token.id;
				session.user.email = token.email;
				session.user.username = token.username;
				session.user.role = token.role;
				session.user.isActive = token.isActive;
				session.user.reputation = token.reputation;
				session.user.profile = token.profile;
				session.user.lastLogin = token.lastLogin;
				session.user.emailVerified = token.emailVerified;
			}
			return session;
		},

		async redirect({ url, baseUrl }) {
			if (url.startsWith("/")) return `${baseUrl}${url}`;
			if (new URL(url).origin === baseUrl) return url;
			return `${baseUrl}/dashboard`;
		},
	},

	events: {
		async createUser({ user }) {
			await connectDB;

			const existingUser = await User.findOne({ email: user.email });
			if (existingUser) return; // user already created by adapter

			// Optionally update fields if missing
			await User.updateOne(
				{ email: user.email },
				{
					$setOnInsert: {
						profile: {
							name: user.name || "",
							avatar: user.image || "",
							timezone: "UTC",
							preferences: {
								defaultView: "grid",
								notifications: true,
								theme: "system",
							},
						},
						role: "user",
						isActive: true,
						reputation: 0,
						socialSettings: {
							profileVisibility: "public",
							allowMessages: true,
						},
						publicProfile: {},
						lastLogin: new Date(),
					},
				},
				{ upsert: true }
			);
		},
	},

	pages: {
		signIn: "/auth/signin",
		error: "/auth/error",
	},

	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60,
	},

	jwt: {
		maxAge: 30 * 24 * 60 * 60,
	},

	debug: process.env.NODE_ENV === "development",

	useSecureCookies: process.env.NODE_ENV === "production",

	logger: {
		error(code, metadata) {
			console.error(`NextAuth Error [${code}]:`, metadata);
		},
		warn(code) {
			console.warn(`NextAuth Warning [${code}]`);
		},
		debug(code, metadata) {
			if (process.env.NODE_ENV === "development") {
				console.log(`NextAuth Debug [${code}]:`, metadata);
			}
		},
	},
};
