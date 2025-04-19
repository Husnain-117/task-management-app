# Deploying to Netlify

This guide will walk you through deploying your Next.js application to Netlify.

## Prerequisites

1. A Netlify account (sign up at [netlify.com](https://www.netlify.com/))
2. A Git repository with your code (GitHub, GitLab, or Bitbucket)
3. A hosted database service (since Netlify doesn't support file-based databases)

## Step 1: Set Up a Hosted Database

For a production deployment, you'll need a hosted database service. Here are some options:

### Option 1: PlanetScale (MySQL)

1. Sign up for [PlanetScale](https://planetscale.com/)
2. Create a new database
3. Get your connection string from the "Connect" button
4. Update your `DATABASE_URL` environment variable in Netlify

### Option 2: Supabase (PostgreSQL)

1. Sign up for [Supabase](https://supabase.com/)
2. Create a new project
3. Get your connection string from the "Settings" > "Database" section
4. Update your `DATABASE_URL` environment variable in Netlify

### Option 3: Neon (PostgreSQL)

1. Sign up for [Neon](https://neon.tech/)
2. Create a new project
3. Get your connection string from the dashboard
4. Update your `DATABASE_URL` environment variable in Netlify

## Step 2: Deploy to Netlify

### Option 1: Deploy via Netlify UI

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Log in to [Netlify](https://app.netlify.com/)
3. Click "Add new site" > "Import an existing project"
4. Connect to your Git provider and select your repository
5. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Add the following environment variables:
   - `DATABASE_URL`: Your hosted database connection string
   - `NEXTAUTH_URL`: The URL of your Netlify site (e.g., https://your-app.netlify.app)
   - `NEXTAUTH_SECRET`: A random string for session encryption
   - `GOOGLE_CLIENT_ID`: Your Google OAuth client ID (if using Google sign-in)
   - `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret (if using Google sign-in)
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

4. Set environment variables:
   ```bash
   netlify env:set DATABASE_URL "your-database-url"
   netlify env:set NEXTAUTH_URL "https://your-app.netlify.app"
   netlify env:set NEXTAUTH_SECRET "your-secret"
   netlify env:set GOOGLE_CLIENT_ID "your-google-client-id"
   netlify env:set GOOGLE_CLIENT_SECRET "your-google-client-secret"
   ```

## Step 3: Run Database Migrations

After deploying, you need to run database migrations:

1. Go to your Netlify dashboard
2. Navigate to "Functions"
3. Find the `migrate` function
4. Click "Invoke function"

Alternatively, you can run migrations manually:

```bash
netlify functions:invoke migrate
```

## Troubleshooting

### Database Connection Issues

If you're having trouble connecting to your database:

1. Check that your `DATABASE_URL` is correct
2. Ensure your database service allows connections from Netlify's IP addresses
3. Check the Netlify logs for specific error messages

### Authentication Issues

If authentication isn't working:

1. Verify that `NEXTAUTH_URL` is set to your Netlify site URL
2. Check that `NEXTAUTH_SECRET` is set
3. If using Google authentication, ensure your OAuth credentials are configured correctly

### Build Failures

If your build is failing:

1. Check the build logs in the Netlify dashboard
2. Ensure all dependencies are correctly listed in `package.json`
3. Verify that your build command is correct

## Additional Resources

- [Netlify Docs](https://docs.netlify.com/)
- [Next.js on Netlify](https://docs.netlify.com/integrations/frameworks/next-js/overview/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [NextAuth.js Docs](https://next-auth.js.org/) 