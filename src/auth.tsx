import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import LoadingPage from "./components/LoadingPage";

const ProtectedRoute = ({ isSecretarioExclusive=false, children }: { isSecretarioExclusive?: boolean,children: React.ReactNode }) => {
	const router = useRouter();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Check if user is authenticated, e.g., by checking the presence of the authentication token
		// const isAuthenticated = !!document.cookie.includes("session");
		const session = Cookies.get('session');
		const user = session ? JSON.parse(session) : undefined;
		
		
		if (!user) {
			// If user is not authenticated, redirect to login page
			router.push("/");
		} else if (isSecretarioExclusive && !user?.secretarioId) {
			// If user is authenticated but is not a secretario, redirect to 404 page
			router.push("/404");
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
		// const isAuthenticated = !!document.cookie.includes("session");
		const session = Cookies.get('session');
		const user = session ? JSON.parse(session) : undefined;
		
		if (user) {
			// If user is authenticated, redirect to afastamentos page
			router.push("/afastamento");
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

