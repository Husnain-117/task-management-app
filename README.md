# Task Manager Application

A simple task management application built with Next.js, Prisma, and NextAuth.

## Features

- User authentication (email/password and Google)
- Create, read, update, and delete tasks
- Mark tasks as completed
- Responsive design

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your actual values.

4. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.


- [Supabase](https://supabase.com/) (PostgreSQL)
- [Neon](https://neon.tech/) (PostgreSQL)
- [Railway](https://railway.app/) (PostgreSQL)

Update your `DATABASE_URL` environment variable accordingly. 
