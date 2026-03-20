import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET() {
  const session = await getServerSession(authOptions as any)

  if (!session) {
    return new Response("Unauthorized", { status: 401 })
  }

  if ((session.user as any)?.role !== "admin") {
    return new Response("Forbidden", { status: 403 })
  }

  return Response.json({
    message: "Admin-only data",
  })
}