"use client"

import { useAuth } from "@/lib/auth/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { MyRequests } from "@/components/my-requests"

export default function MyRequestsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          Loading...
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <MyRequests />
    </div>
  )
}
