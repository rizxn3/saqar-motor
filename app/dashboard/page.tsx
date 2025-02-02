"use client"

import { useAuth } from "@/lib/auth/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Settings } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="container max-w-screen-lg mx-auto px-4 py-12">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Your Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center gap-4">
                <User className="w-12 h-12 text-muted-foreground" />
                <div>
                  <h2 className="text-xl font-semibold">User Information</h2>
                  <p className="text-muted-foreground">
                    Manage your account and settings
                  </p>
                </div>
              </div>
              <div className="grid gap-2">
                <Button asChild variant="outline">
                  <Link href="/profile" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Edit Profile
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 