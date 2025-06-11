// lib/mongoose.ts
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI!;
if (!uri) throw new Error("MONGODB_URI not defined");

declare global {
	var _mongooseConnection: Promise<typeof mongoose> | undefined;
}

let mongooseConnection: Promise<typeof mongoose>;

if (process.env.NODE_ENV === "development") {
	if (!global._mongooseConnection) {
		global._mongooseConnection = mongoose.connect(uri);
	}
	mongooseConnection = global._mongooseConnection;
} else {
	mongooseConnection = mongoose.connect(uri);
}

export default mongooseConnection;
