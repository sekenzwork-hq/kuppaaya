import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (email === "admin@kuppaaya.com" && password === "admin123") {
      const response = NextResponse.json({ success: true, message: "Logged in successfully" });
      response.cookies.set("kuppaaya-admin-session", "authenticated", {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400 // 1 day
      });
      return response;
    }

    return NextResponse.json(
      { success: false, error: "Invalid credentials" },
      { status: 401 }
    );
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || "Failed to process request" }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Logged out successfully" });
  response.cookies.set("kuppaaya-admin-session", "", {
    path: "/",
    httpOnly: true,
    maxAge: 0
  });
  return response;
}
