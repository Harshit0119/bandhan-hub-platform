// app/verify-email/page.tsx

export default function VerifyEmailPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold mb-4">
          Verify your email 📩
        </h1>

        <p className="text-muted-foreground mb-6">
          We’ve sent a verification link to your email.
          Please check your inbox and click the link to continue.
        </p>
      </div>
    </div>
  )
}