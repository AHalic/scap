import type { NextRequest } from "next/server";

export const middleware = (request: NextRequest) => {
	const currentUser = request.cookies.get("session")?.value;

	console.log("currentUser", currentUser);

	if (currentUser && !request.nextUrl.pathname.startsWith("/afastamento")) {
		return Response.redirect(new URL("/afastamento", request.url));
	}

	if (!currentUser && !request.nextUrl.pathname.startsWith("/")) {
		return Response.redirect(new URL("/", request.url));
	}
};

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};

