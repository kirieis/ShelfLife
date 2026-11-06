"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { useBooks, Book } from "@/context/BookContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function BooksPage() {
  const { user, loading: authLoading } = useAuth()
  const { books, addBook, advanceStatus, deleteBook } = useBooks()
  const router = useRouter()

  // Form state
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [pages, setPages] = useState("")
  const [status, setStatus] = useState<"" | "To Read" | "Reading" | "Finished">("")

  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [bookSuccess, setBookSuccess] = useState("")
  const [bookError, setBookError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Filter & Search state
  const [filterStatus, setFilterStatus] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  // Authentication guard: prevent flash of content or wrong redirect
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login")
    }
  }, [user, authLoading, router])

  if (authLoading || !user) {
    return null
  }

  // Add Book Validation helpers
  const getTitleError = (val: string) => {
    if (!val || val.trim() === "") return "Title is required"
    if (val.length > 80) return "Title must be at most 80 characters"
    return ""
  }

  const getAuthorError = (val: string) => {
    if (!val || val.trim() === "") return "Author is required"
    if (val.length > 60) return "Author must be at most 60 characters"
    return ""
  }

  const getPagesError = (val: string) => {
    if (!val || val.trim() === "") return "Pages is required"
    if (!/^\d+$/.test(val.trim())) {
      return "Pages must be a whole number between 1 and 5000"
    }
    const num = parseInt(val.trim(), 10)
    if (num < 1 || num > 5000) {
      return "Pages must be a whole number between 1 and 5000"
    }
    return ""
  }

  const getStatusError = (val: string) => {
    if (!val) return "Please choose a status"
    return ""
  }

  // Live error states after first submission
  const errorTitle = hasSubmitted ? getTitleError(title) : ""
  const errorAuthor = hasSubmitted ? getAuthorError(author) : ""
  const errorPages = hasSubmitted ? getPagesError(pages) : ""
  const errorStatus = hasSubmitted ? getStatusError(status) : ""

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault()
    setHasSubmitted(true)
    setBookSuccess("")
    setBookError("")

    const errTitle = getTitleError(title)
    const errAuthor = getAuthorError(author)
    const errPages = getPagesError(pages)
    const errStatus = getStatusError(status)

    if (errTitle || errAuthor || errPages || errStatus) {
      return
    }

    setIsSubmitting(true)
    try {
      const res = await addBook({
        title: title.trim(),
        author: author.trim(),
        pages: parseInt(pages.trim(), 10),
        status: status as "To Read" | "Reading" | "Finished",
      })

      if (res.error) {
        setBookError(res.error.message || "Failed to add book")
      } else {
        // Success: clear form and reset submitted flag
        setTitle("")
        setAuthor("")
        setPages("")
        setStatus("")
        setHasSubmitted(false)
        setBookSuccess("Book added")
      }
    } catch (err: any) {
      setBookError(err.message || "An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClearFilters = () => {
    setFilterStatus("")
    setSearchQuery("")
  }

  // Filter & Search logic
  const filteredBooks = books.filter((book) => {
    const q = searchQuery.trim().toLowerCase()
    const matchesSearch =
      !q ||
      book.title.toLowerCase().includes(q) ||
      book.author.toLowerCase().includes(q)

    const matchesStatus = !filterStatus || book.status === filterStatus

    return matchesSearch && matchesStatus
  })

  // Summary calculations
  const totalPages = filteredBooks.reduce((sum, b) => sum + (b.pages || 0), 0)

  // Status breakdown: only statuses that appear among currently shown books
  const statusPriority: Record<string, number> = {
    "To Read": 1,
    "Reading": 2,
    "Finished": 3,
  }

  const statusCounts: Record<string, number> = {}
  filteredBooks.forEach((b) => {
    statusCounts[b.status] = (statusCounts[b.status] || 0) + 1
  })

  const breakdown = Object.entries(statusCounts)
    .map(([st, cnt]) => ({ status: st, count: cnt }))
    .sort((a, b) => {
      // Most books first
      if (b.count !== a.count) {
        return b.count - a.count
      }
      // Equal counts: To Read, then Reading, then Finished
      return (statusPriority[a.status] || 99) - (statusPriority[b.status] || 99)
    })

  return (
    <div data-testid="books-page" className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Column (At 1280px / xl: sits next to list): Form and Summary */}
        <div className="xl:col-span-5 space-y-6">
          {/* Add a Book Form */}
          <Card>
            <CardHeader>
              <CardTitle>Add a Book</CardTitle>
            </CardHeader>
            <CardContent>
              <form data-testid="book-form" noValidate onSubmit={handleAddBook} className="space-y-4">
                {bookError && (
                  <div data-testid="error-book" className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
                    {bookError}
                  </div>
                )}
                {bookSuccess && (
                  <div data-testid="book-success" className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded">
                    {bookSuccess}
                  </div>
                )}

                {/* Title */}
                <div className="space-y-1">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    type="text"
                    data-testid="input-title"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value)
                      if (bookSuccess) setBookSuccess("")
                      if (bookError) setBookError("")
                    }}
                    placeholder="Enter book title"
                  />
                  {errorTitle && (
                    <p data-testid="error-title" className="text-sm text-red-600">
                      {errorTitle}
                    </p>
                  )}
                </div>

                {/* Author */}
                <div className="space-y-1">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    type="text"
                    data-testid="input-author"
                    value={author}
                    onChange={(e) => {
                      setAuthor(e.target.value)
                      if (bookSuccess) setBookSuccess("")
                      if (bookError) setBookError("")
                    }}
                    placeholder="Enter author name"
                  />
                  {errorAuthor && (
                    <p data-testid="error-author" className="text-sm text-red-600">
                      {errorAuthor}
                    </p>
                  )}
                </div>

                {/* Pages */}
                <div className="space-y-1">
                  <Label htmlFor="pages">Pages</Label>
                  <Input
                    id="pages"
                    type="text"
                    data-testid="input-pages"
                    value={pages}
                    onChange={(e) => {
                      setPages(e.target.value)
                      if (bookSuccess) setBookSuccess("")
                      if (bookError) setBookError("")
                    }}
                    placeholder="e.g. 320"
                  />
                  {errorPages && (
                    <p data-testid="error-pages" className="text-sm text-red-600">
                      {errorPages}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div className="space-y-1">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    data-testid="select-status"
                    className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-600"
                    value={status}
                    onChange={(e) => {
                      setStatus(e.target.value as any)
                      if (bookSuccess) setBookSuccess("")
                      if (bookError) setBookError("")
                    }}
                  >
                    <option value="">Choose status</option>
                    <option value="To Read">To Read</option>
                    <option value="Reading">Reading</option>
                    <option value="Finished">Finished</option>
                  </select>
                  {errorStatus && (
                    <p data-testid="error-status" className="text-sm text-red-600">
                      {errorStatus}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  data-testid="btn-add-book"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding..." : "Add Book"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Shelf Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 border rounded text-center">
                  <span className="block text-xs uppercase font-medium text-gray-500 mb-1">Books</span>
                  <span data-testid="book-count" className="text-2xl font-bold text-gray-900">
                    {filteredBooks.length}
                  </span>
                </div>
                <div className="p-3 bg-gray-50 border rounded text-center">
                  <span className="block text-xs uppercase font-medium text-gray-500 mb-1">Total Pages</span>
                  <span data-testid="total-pages" className="text-2xl font-bold text-gray-900">
                    {totalPages}
                  </span>
                </div>
              </div>

              {/* Status Breakdown */}
              <div className="pt-2">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Breakdown</h4>
                <div data-testid="status-breakdown" className="space-y-2">
                  {breakdown.map((item) => (
                    <div
                      key={item.status}
                      data-testid="breakdown-row"
                      className="flex justify-between items-center px-3 py-2 bg-gray-50 rounded border text-sm"
                    >
                      <span data-testid="breakdown-name" className="font-medium text-gray-700">
                        {item.status}
                      </span>
                      <span data-testid="breakdown-count" className="font-bold text-gray-900">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Filter/Search and Book List */}
        <div className="xl:col-span-7 space-y-6">
          {/* Filter & Search Bar */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="w-full sm:w-1/3">
                  <select
                    data-testid="filter-status"
                    className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-600"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="">All</option>
                    <option value="To Read">To Read</option>
                    <option value="Reading">Reading</option>
                    <option value="Finished">Finished</option>
                  </select>
                </div>

                <div className="w-full sm:flex-1">
                  <Input
                    type="text"
                    data-testid="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title or author..."
                  />
                </div>

                <Button
                  type="button"
                  data-testid="btn-clear-filters"
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                  className="w-full sm:w-auto"
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Book List / Empty state */}
          {filteredBooks.length === 0 ? (
            <div
              data-testid="books-empty"
              className="p-12 text-center border-2 border-dashed border-gray-200 rounded-lg text-gray-500 bg-white"
            >
              No books found
            </div>
          ) : (
            <div data-testid="book-list" className="space-y-4">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  data-testid="book-item"
                  className="p-5 bg-white border rounded-lg shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <h3 data-testid="book-title" className="text-lg font-bold text-gray-900 leading-tight">
                      {book.title}
                    </h3>
                    <p data-testid="book-author" className="text-sm text-gray-600">
                      {book.author}
                    </p>
                    <div className="flex items-center gap-3 pt-1 text-xs">
                      <span data-testid="book-pages" className="text-gray-500 font-medium">
                        {book.pages} pages
                      </span>
                      <span
                        data-testid="book-status"
                        className={`px-2 py-0.5 rounded-full font-semibold ${
                          book.status === "Finished"
                            ? "bg-green-100 text-green-800"
                            : book.status === "Reading"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {book.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 sm:pt-0">
                    {book.status !== "Finished" && (
                      <Button
                        type="button"
                        data-testid="btn-advance-status"
                        size="sm"
                        variant="secondary"
                        onClick={() => advanceStatus(book)}
                      >
                        Advance
                      </Button>
                    )}
                    <Button
                      type="button"
                      data-testid="btn-delete-book"
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteBook(book.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

