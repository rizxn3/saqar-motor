import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function isAdmin() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return false
    }

    const user = await prisma.users.findUnique({
      where: { email: session.user.email },
      select: { role: true }
    })

    return user?.role === 'ADMIN'
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}
