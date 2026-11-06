"use client"

import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { BookOpen, LogOut, User as UserIcon } from "lucide-react"

export default function Header() {
  const { user, signOut, loading } = useAuth()

  return (
    <header className="border-b bg-white/95 backdrop-blur shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* App Brand */}
        <Link href="/" className="text-xl font-bold text-blue-600 flex items-center gap-2 hover:opacity-90 transition-opacity">
          <div className="w-8 h-8 rounded-md bg-blue-600 text-white flex items-center justify-center shadow-sm">
            <BookOpen className="w-5 h-5" />
          </div>
          <span>ShelfLife</span>
        </Link>

        {/* Right Nav */}
        <div className="flex items-center gap-3">
          {!loading && user ? (
            <>
              {/* Primary Books Navigation Button */}
              <Link
                href="/books"
                data-testid="link-books"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
              >
                <BookOpen className="w-4 h-4" />
                Books
              </Link>

              {/* User Email Pill */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full border border-gray-200 max-w-[180px] sm:max-w-none">
                <UserIcon className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                <span data-testid="user-email" className="truncate">{user.email}</span>
              </div>

              {/* Logout Button */}
              <Button
                data-testid="btn-logout"
                variant="outline"
                size="sm"
                onClick={() => signOut()}
                className="text-gray-700 hover:text-red-600 hover:border-red-200 hover:bg-red-50 flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
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
                <Button data-testid="btn-register" size="sm" className="bg-blue-600 hover:bg-blue-700">
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
