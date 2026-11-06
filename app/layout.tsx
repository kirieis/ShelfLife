import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { BookProvider } from "@/context/BookContext";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "ShelfLife",
  description: "ShelfLife book tracking application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 flex flex-col text-gray-900">
        <AuthProvider>
          <BookProvider>
            <Header />
            <main className="flex-1">{children}</main>
          </BookProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
