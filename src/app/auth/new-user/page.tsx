"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";

export default function NewUserPage() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [userName, setUserName] = useState<string | null>(null);
	const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

	useEffect(() => {
		const loadUser = async () => {
			const session = await getSession();
			if (session?.user?.name) {
				setUserName(session.user.name);
			}
		};
		loadUser();
	}, []);

	const handleContinue = () => {
		router.push(callbackUrl);
	};

	return (
		<main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
			<div className="max-w-md w-full bg-white shadow-lg rounded-xl p-6 text-center">
				<h1 className="text-2xl font-bold mb-2">
					Welcome{userName ? `, ${userName}` : ""}!
				</h1>
				<p className="text-gray-600 mb-6">
					Thanks for joining. We’ve set up your account. You’re all ready to go!
				</p>
				<button
					onClick={handleContinue}
					className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
				>
					Continue to Dashboard
				</button>
			</div>
		</main>
	);
}
