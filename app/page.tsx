"use client"

import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { BookOpen, PlusCircle, TrendingUp, Search, ArrowRight } from "lucide-react"

export default function HomePage() {
  const { user, loading } = useAuth()

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" /> Personal Reading Tracker
        </div>

        <h1 data-testid="home-title" className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
          ShelfLife
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          A small web app where each person keeps a list of the books they want to read, are reading or have finished, and sees how much they have on their shelf.
        </p>

        {/* Prominent Call-to-Action right in the center */}
        <div className="pt-4 flex justify-center items-center gap-3">
          {!loading && user ? (
            <Link href="/books">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-6 text-base shadow-md flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Go to My Bookshelf
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          ) : !loading && !user ? (
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/register">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-6 text-base shadow-md flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="px-6 py-6 text-base font-semibold">
                  Login to Your Shelf
                </Button>
              </Link>
            </div>
          ) : null}
        </div>
      </div>

      {/* Feature Cards - Interactive & Clickable */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href={user ? "/books" : "/login"} className="group block">
          <Card className="h-full transition-all duration-200 group-hover:shadow-lg group-hover:border-blue-300 group-hover:-translate-y-1 bg-white cursor-pointer">
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-2 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <PlusCircle className="w-5 h-5" />
              </div>
              <CardTitle className="text-xl group-hover:text-blue-600 transition-colors flex items-center justify-between">
                Add books
                <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-600" />
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 leading-normal">
                Catalog books you want to read with page counts, author details, and reading status.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href={user ? "/books" : "/login"} className="group block">
          <Card className="h-full transition-all duration-200 group-hover:shadow-lg group-hover:border-blue-300 group-hover:-translate-y-1 bg-white cursor-pointer">
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <TrendingUp className="w-5 h-5" />
              </div>
              <CardTitle className="text-xl group-hover:text-emerald-600 transition-colors flex items-center justify-between">
                Track your progress
                <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-emerald-600" />
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 leading-normal">
                Advance your books from To Read to Reading and Finished with a single click.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href={user ? "/books" : "/login"} className="group block">
          <Card className="h-full transition-all duration-200 group-hover:shadow-lg group-hover:border-blue-300 group-hover:-translate-y-1 bg-white cursor-pointer">
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-2 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Search className="w-5 h-5" />
              </div>
              <CardTitle className="text-xl group-hover:text-purple-600 transition-colors flex items-center justify-between">
                Search your shelf
                <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-purple-600" />
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 leading-normal">
                Filter by status, search by title or author, and get real-time page summaries.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  )
}
