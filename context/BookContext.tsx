"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/context/AuthContext"

export interface Book {
  id: string
  user_id: string
  title: string
  author: string
  pages: number
  status: "To Read" | "Reading" | "Finished"
  created_at: string
}

interface BookContextType {
  books: Book[]
  loading: boolean
  addBook: (bookData: { title: string; author: string; pages: number; status: "To Read" | "Reading" | "Finished" }) => Promise<{ data?: Book; error?: any }>
  advanceStatus: (book: Book) => Promise<{ success: boolean; error?: any }>
  deleteBook: (id: string) => Promise<{ success: boolean; error?: any }>
}

const BookContext = createContext<BookContextType>({
  books: [],
  loading: false,
  addBook: async () => ({}),
  advanceStatus: async () => ({ success: false }),
  deleteBook: async () => ({ success: false }),
})

export function BookProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)

  const fetchBooks = useCallback(async () => {
    if (!user) {
      setBooks([])
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching books:", error)
      } else if (data) {
        setBooks(data as Book[])
      }
    } catch (err) {
      console.error("Unexpected error fetching books:", err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      fetchBooks()
    } else {
      // Clear memory and screen on logout / when not logged in
      setBooks([])
    }
  }, [user, fetchBooks])

  const addBook = async (bookData: {
    title: string
    author: string
    pages: number
    status: "To Read" | "Reading" | "Finished"
  }) => {
    if (!user) {
      return { error: { message: "User not authenticated" } }
    }

    try {
      const { data, error } = await supabase
        .from("books")
        .insert({
          user_id: user.id,
          title: bookData.title,
          author: bookData.author,
          pages: bookData.pages,
          status: bookData.status,
        })
        .select()
        .single()

      if (error) {
        return { error }
      }

      if (data) {
        // Appears in the list at once without reloading the page, most recently added first
        setBooks((prev) => [data as Book, ...prev])
        return { data: data as Book }
      }

      return { error: { message: "Failed to create book" } }
    } catch (err: any) {
      return { error: err }
    }
  }

  const advanceStatus = async (book: Book) => {
    let nextStatus: "Reading" | "Finished" | null = null
    if (book.status === "To Read") {
      nextStatus = "Reading"
    } else if (book.status === "Reading") {
      nextStatus = "Finished"
    }

    if (!nextStatus) {
      return { success: false }
    }

    try {
      const { error } = await supabase
        .from("books")
        .update({ status: nextStatus })
        .eq("id", book.id)

      if (error) {
        return { success: false, error }
      }

      setBooks((prev) =>
        prev.map((b) => (b.id === book.id ? { ...b, status: nextStatus! } : b))
      )
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err }
    }
  }

  const deleteBook = async (id: string) => {
    try {
      const { error } = await supabase.from("books").delete().eq("id", id)

      if (error) {
        return { success: false, error }
      }

      setBooks((prev) => prev.filter((b) => b.id !== id))
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err }
    }
  }

  return (
    <BookContext.Provider
      value={{
        books,
        loading,
        addBook,
        advanceStatus,
        deleteBook,
      }}
    >
      {children}
    </BookContext.Provider>
  )
}

export const useBooks = () => useContext(BookContext)

