"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { authClient } from "@/lib/auth-client"

export function OAuthButtons() {
  const router = useRouter()
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isFacebookLoading, setIsFacebookLoading] = useState(false)

  async function handleGoogleSignIn() {
    setIsGoogleLoading(true)

    try {
      // In a real app, you would call your OAuth provider here
      console.log("Google sign in")

      await authClient.signIn.social({
        provider: "google"
    })

      // Redirect to home page after successful sign in
      router.push("/")
    } catch (error) {
      console.error("Google sign in error:", error)
    } finally {
      setIsGoogleLoading(false)
    }
  }

  async function handleFacebookSignIn() {
    setIsFacebookLoading(true)

    try {
      // In a real app, you would call your OAuth provider here
      console.log("Facebook sign in")

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to home page after successful sign in
      router.push("/")
    } catch (error) {
      console.error("Facebook sign in error:", error)
    } finally {
      setIsFacebookLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        variant="outline"
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading || isFacebookLoading}
        className="w-full"
      >
        {isGoogleLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <svg
            className="mr-2 h-4 w-4"
            aria-hidden="true"
            focusable="false"
            data-prefix="fab"
            data-icon="google"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 488 512"
          >
            <path
              fill="currentColor"
              d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
            ></path>
          </svg>
        )}
        Google
      </Button>
      <Button
        variant="outline"
        onClick={handleFacebookSignIn}
        disabled={isGoogleLoading || isFacebookLoading}
        className="w-full"
      >
        {isFacebookLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <svg
            className="mr-2 h-4 w-4"
            aria-hidden="true"
            focusable="false"
            data-prefix="fab"
            data-icon="facebook"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path
              fill="currentColor"
              d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"
            ></path>
          </svg>
        )}
        Facebook
      </Button>
    </div>
  )
}
