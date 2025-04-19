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

## Deployment to Netlify

### Option 1: Deploy via Netlify UI

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Log in to [Netlify](https://app.netlify.com/)
3. Click "Add new site" > "Import an existing project"
4. Connect to your Git provider and select your repository
5. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Add environment variables from your `.env` file
7. Click "Deploy site"

### Option 2: Deploy via Netlify CLI

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Initialize and deploy:
   ```bash
   netlify init
   netlify deploy --prod
   ```

## Environment Variables

- `DATABASE_URL`: Your database connection string
- `NEXTAUTH_URL`: The URL of your application (e.g., https://your-app.netlify.app)
- `NEXTAUTH_SECRET`: A random string used to encrypt cookies
- `GOOGLE_CLIENT_ID`: Your Google OAuth client ID (if using Google sign-in)
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret (if using Google sign-in)

## Database Considerations for Netlify

For Netlify deployments, you'll need to use a hosted database service since Netlify doesn't support persistent file-based databases. Consider using:

- [PlanetScale](https://planetscale.com/) (MySQL)
- [Supabase](https://supabase.com/) (PostgreSQL)
- [Neon](https://neon.tech/) (PostgreSQL)
- [Railway](https://railway.app/) (PostgreSQL)

Update your `DATABASE_URL` environment variable accordingly. 