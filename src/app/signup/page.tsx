import type { Metadata } from "next"
import Link from "next/link"
import { PageHeader } from "@/components/ui/page-header"
import { SignUpForm } from "@/components/auth/sign-upform"

export const metadata: Metadata = {
  title: "Sign Up | Auctioneer",
  description: "Create an Auctioneer account",
}

export default function SignUpPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <PageHeader title="Sign Up" className="text-center" />
          <p className="text-sm text-muted-foreground">Create an account to start bidding on auctions</p>
        </div>
        <SignUpForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/signin" className="underline underline-offset-4 hover:text-primary">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
