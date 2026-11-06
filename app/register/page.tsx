"use client"

import { useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [authError, setAuthError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [loading, setLoading] = useState(false)

  // Validation logic
  const getEmailError = (val: string) => {
    if (!val || val.trim() === "") return "Email is required"
    if (!isValidEmail(val.trim())) return "Please enter a valid email address"
    return ""
  }

  const getPasswordError = (val: string) => {
    if (!val) return "Password is required"
    if (val.length < 6) return "Password must be at least 6 characters"
    return ""
  }

  const getConfirmPasswordError = (val: string, pwd: string) => {
    if (!val) return "Confirm password is required"
    if (val !== pwd) return "Passwords do not match"
    return ""
  }

  const emailError = hasSubmitted ? getEmailError(email) : ""
  const passwordError = hasSubmitted ? getPasswordError(password) : ""
  const confirmPasswordError = hasSubmitted ? getConfirmPasswordError(confirmPassword, password) : ""

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setHasSubmitted(true)
    setAuthError("")
    setSuccessMessage("")

    const errEmail = getEmailError(email)
    const errPassword = getPasswordError(password)
    const errConfirm = getConfirmPasswordError(confirmPassword, password)

    if (errEmail || errPassword || errConfirm) {
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      })

      if (error) {
        setAuthError(error.message)
      } else if (data.user) {
        // If Supabase returns empty identities (user already registered with email enumeration protection)
        if (data.user.identities && data.user.identities.length === 0) {
          setAuthError("User already registered")
        } else {
          setSuccessMessage("Registration successful")
        }
      }
    } catch (err: any) {
      setAuthError(err.message || "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form data-testid="register-form" noValidate onSubmit={handleSubmit} className="space-y-4">
            {authError && (
              <div data-testid="error-auth" className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
                {authError}
              </div>
            )}
            {successMessage && (
              <div data-testid="form-success" className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded">
                {successMessage}
              </div>
            )}

            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                data-testid="register-email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (authError) setAuthError("")
                }}
              />
              {emailError && (
                <p data-testid="error-email" className="text-sm text-red-600">
                  {emailError}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                data-testid="register-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (authError) setAuthError("")
                }}
              />
              {passwordError && (
                <p data-testid="error-password" className="text-sm text-red-600">
                  {passwordError}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                data-testid="register-confirm-password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  if (authError) setAuthError("")
                }}
              />
              {confirmPasswordError && (
                <p data-testid="error-confirm-password" className="text-sm text-red-600">
                  {confirmPasswordError}
                </p>
              )}
            </div>

            <Button
              type="submit"
              data-testid="register-submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </Button>

            <p className="text-sm text-center text-gray-600 mt-4">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
