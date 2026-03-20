import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions as any);

  // ❌ No session
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  // ✅ Safe access (fixes Vercel TypeScript error)
  const user = (session as any)?.user;

  // ❌ Not admin
  if (!user || user.role !== "admin") {
    return new Response("Forbidden", { status: 403 });
  }

  // ✅ Success
  return Response.json({
    message: "Admin-only data",
  });
}