import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import LoadingPage from "./components/LoadingPage";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const router = useRouter();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Check if user is authenticated, e.g., by checking the presence of the authentication token
		const isAuthenticated = !!document.cookie.includes("session");

		if (!isAuthenticated) {
			// If user is not authenticated, redirect to login page
			router.push("/");
		} else {
			setLoading(false);
		}
	}, []);

	return (
		<>
			{loading ? <LoadingPage /> : children}
		</>
	);
};

export const RedirectLogin = ({ children }: { children: React.ReactNode }): React.ReactNode => {
	const router = useRouter();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Check if user is authenticated, e.g., by checking the presence of the authentication token
		const isAuthenticated = !!document.cookie.includes("session");
		
		if (isAuthenticated) {
			// If user is authenticated, redirect to afastamentos page
			router.push("/afastamentos");
		} else {
			setLoading(false);
		}
	}, []);

	return (
		<>
			{loading ? <LoadingPage/> : children}
		</>
	);
};

export default ProtectedRoute;

