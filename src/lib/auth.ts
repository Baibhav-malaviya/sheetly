// lib/auth.ts (or utils/auth.ts)
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export const getSession = () => getServerSession(authOptions);
