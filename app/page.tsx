import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 data-testid="home-title" className="text-4xl font-extrabold tracking-tight mb-3">
          ShelfLife
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          A small web app where each person keeps a list of the books they want to read, are reading or have finished, and sees how much they have on their shelf.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Add books</CardTitle>
            <CardDescription>
              Catalog books you want to read with page counts, author details, and reading status.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Track your progress</CardTitle>
            <CardDescription>
              Advance your books from To Read to Reading and Finished with a single click.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Search your shelf</CardTitle>
            <CardDescription>
              Filter by status, search by title or author, and get real-time page summaries.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
