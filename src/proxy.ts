import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const publicPaths = [
    "/",
    "/signup",
    "/signin",
    "/dashboard/doctor",
    "/dashboard/doctor/signup",
  ];
  const { pathname } = req.nextUrl;
  const isPublicRoute = publicPaths.includes(pathname);

  if (!token && !isPublicRoute) {
    console.log(" User not logged in → Redirecting to /login", pathname);
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  if (token && isPublicRoute) {
    const redirectPath =
      token.role === "DOCTOR" ? "/dashboard/doctor" : "/dashboard/patient";
    return NextResponse.redirect(new URL(redirectPath, req.url));
  }

  // Only DOCTOR can access /doctor/dashboard/*
  if (token && pathname.startsWith("/doctor") && token.role !== "DOCTOR") {
    console.log("🚫 Non-doctor tried to access doctor dashboard →", pathname);
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
