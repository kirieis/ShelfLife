"use client"

import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"

export default function Header() {
  const { user, signOut, loading } = useAuth()

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600">
          ShelfLife
        </Link>
        <div className="flex items-center gap-4">
          {!loading && user ? (
            <>
              <span data-testid="user-email" className="text-sm font-medium text-gray-700">
                {user.email}
              </span>
              <Link href="/books" data-testid="link-books" className="text-sm font-medium text-blue-600 hover:underline">
                Books
              </Link>
              <Button
                data-testid="btn-logout"
                variant="outline"
                size="sm"
                onClick={() => signOut()}
              >
                Logout
              </Button>
            </>
          ) : !loading && !user ? (
            <>
              <Link href="/login">
                <Button data-testid="btn-login" variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button data-testid="btn-register" size="sm">
                  Register
                </Button>
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </header>
  )
}
