# ShelfLife

**A Personal Book Tracking Application**

ShelfLife is a web application that helps users organize and track their personal reading lists. Users can add books, manage their reading progress, search and filter their collection, and view statistics about their books and total pages.

The application is built with Next.js, React, Tailwind CSS, ShadCN UI, and Supabase.

## Features

### 1. User Authentication
- Register a new account using email and password.
- Log in with an existing account.
- Log out securely.
- Form validation with custom error messages.
- User-specific book collections.

### 2. Book Management
- Add books with a title, author, page count, and reading status.
- View all books belonging to the logged-in user.
- Delete books from the collection.
- Update reading progress with one click:
  - To Read → Reading
  - Reading → Finished
- Automatically display newly added books without reloading the page.
- Persist book data in Supabase.

### 3. Search and Filtering
- Filter books by reading status:
  - All
  - To Read
  - Reading
  - Finished
- Search books by title or author.
- Case-insensitive search.
- Combine search and status filters.
- Clear all active filters with one action.

### 4. Reading Statistics
- Display the number of books currently shown.
- Calculate the total number of pages.
- Show a breakdown of books by reading status.
- Automatically update statistics when books are added, deleted, searched, filtered, or updated.

### 5. Data Security
- Supabase Authentication for user accounts.
- Row Level Security (RLS) to protect user data.
- Each user can only access and manage their own books.
- Database constraints to validate book information.

### 6. Responsive Interface
- Responsive layout for desktop and mobile screens.
- Built with Tailwind CSS and ShadCN UI components.
- Simple and user-friendly interface.

## Technologies Used

| Technology | Purpose |
|---|---|
| Next.js (App Router) | Application framework |
| React | UI development and component state |
| TypeScript | Type-safe development |
| Tailwind CSS | Styling and responsive layout |
| ShadCN UI | Reusable UI components |
| Supabase | Authentication and PostgreSQL database |
| React Context API | Shared authentication and book state |
| Lucide React | Icons |

## Project Structure

```text
shelflife/
├── app/
│   ├── books/
│   │   └── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── label.tsx
│   └── Header.tsx
│
├── context/
│   ├── AuthContext.tsx
│   └── BookContext.tsx
│
├── lib/
│   ├── supabase.ts
│   └── utils.ts
│
├── public/
│
├── supabase/
│   └── books.sql
│
├── .env.example
├── components.json
├── package.json
├── package-lock.json
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- A Supabase account

### 1. Clone the Repository

```bash
git clone https://github.com/username/repository-name.git
cd repository-name
```

Replace the repository URL with your actual GitHub repository URL.

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace the placeholder values with your Supabase project URL and public anon key.

**Important:** Never expose your Supabase `service_role` key in the frontend or commit it to the repository.

### 4. Set Up Supabase

1. Create a new project in [Supabase](https://supabase.com/).
2. Open the SQL Editor in your Supabase dashboard.
3. Open `supabase/books.sql` from this repository.
4. Copy and execute the SQL script.
5. Make sure the `books` table and its Row Level Security policies are created successfully.
6. In Authentication settings, disable email confirmation so newly registered accounts can sign in immediately.

The database contains a `books` table with the following columns:

| Column | Description |
|---|---|
| id | Unique book identifier |
| user_id | ID of the book owner |
| title | Book title |
| author | Book author |
| pages | Number of pages |
| status | Reading status |
| created_at | Book creation timestamp |

The database enforces validation rules for book titles, authors, page counts, and reading statuses.

Row Level Security ensures that authenticated users can only access their own book records.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build for Production

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm run start
```

## Application Routes

| Route | Description | Access |
|---|---|---|
| `/` | Home page | Public |
| `/register` | Create a new account | Public |
| `/login` | Sign in to an account | Public |
| `/books` | Manage books and reading progress | Authenticated users |

## Database Validation Rules

The database enforces the following constraints:

- **Title:** Required, cannot contain only whitespace, maximum 80 characters.
- **Author:** Required, cannot contain only whitespace, maximum 60 characters.
- **Pages:** Must be a whole number between 1 and 5000.
- **Status:** Must be `To Read`, `Reading`, or `Finished`.
- **Default status:** `To Read`.

## Deployment

ShelfLife can be deployed using [Vercel](https://vercel.com/).

1. Push the project to a GitHub repository.
2. Import the repository into Vercel.
3. Configure the following environment variables in Vercel:

   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. Deploy the application.
5. Verify that authentication and database operations work on the production URL.

## License

This project was developed as part of the **FER202 – Practical Exam, Fall 2026**.

