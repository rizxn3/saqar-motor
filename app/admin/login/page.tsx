import { LoginForm } from "@/components/auth/login-form"

export default function AdminLoginPage() {
  return (
    <div className="container max-w-screen-lg mx-auto px-4 py-12">
      <LoginForm isAdmin={true} />
    </div>
  )
} 