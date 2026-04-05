//app\signup\page.tsx
'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Eye, EyeOff, ArrowLeft, Loader2, Users, Store } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signup } = useAuth()
  const [activeTab, setActiveTab] = useState<'couple' | 'vendor'>('couple')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (searchParams.get('vendor') === 'true') {
      setActiveTab('vendor')
    }
  }, [searchParams])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      await signup(email, password, name, activeTab === 'vendor')

      // ✅ NEW FLOW
      toast.success("Account created! Check your email to verify 📩")

      router.push('/verify-email')

    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Signup failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-secondary via-background to-secondary/50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
        <Card className="border-border shadow-xl">
          <CardHeader className="text-center pb-2">
            <Link href="/" className="flex items-center gap-2 justify-center mb-0">
              <Image
                src="/bandhan-hublogo.png"
                alt="BandhanHub Logo"
                className="h-28"
                width={190}
                height={10}
                placeholder="blur"
                blurDataURL="/blur.png"
              />
            </Link>
            <CardTitle className="text-2xl font-serif">Create Account</CardTitle>
            <CardDescription>
              Join BandhanHub to find or offer wedding services
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'couple' | 'vendor')}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="couple" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Couple
                </TabsTrigger>
                <TabsTrigger value="vendor" className="flex items-center gap-2">
                  <Store className="h-4 w-4" />
                  Vendor
                </TabsTrigger>
              </TabsList>

              <TabsContent value="couple">
                <p className="text-sm text-muted-foreground mb-4 text-center">
                  Create a couple account to browse vendors and plan your wedding.
                </p>
              </TabsContent>
              <TabsContent value="vendor">
                <p className="text-sm text-muted-foreground mb-4 text-center">
                  Create a vendor account to showcase your services to couples.
                </p>
              </TabsContent>
            </Tabs>

            <form onSubmit={handleSubmit} className="space-y-4">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">
                    {activeTab === 'vendor' ? 'Business Name' : 'Full Name'}
                  </FieldLabel>
                  <Input
                    id="name"
                    type="text"
                    placeholder={activeTab === 'vendor' ? 'Your business name' : 'Your full name'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={errors.name ? 'border-destructive' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive mt-1">{errors.name}</p>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive mt-1">{errors.email}</p>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
                    />
                    <button aria-label="Open menu"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive mt-1">{errors.password}</p>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={errors.confirmPassword ? 'border-destructive' : ''}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>
                  )}
                </Field>
              </FieldGroup>

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  `Create ${activeTab === 'vendor' ? 'Vendor' : 'Couple'} Account`
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="text-primary font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-linear-to-br from-secondary via-background to-secondary/50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <SignupForm />
    </Suspense>
  )
}
