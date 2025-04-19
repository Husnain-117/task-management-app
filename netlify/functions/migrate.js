// This is a Netlify function to run database migrations
const { execSync } = require('child_process');
const path = require('path');

exports.handler = async function(event, context) {
  try {
    // Run Prisma migrations
    execSync('npx prisma migrate deploy', {
      stdio: 'inherit',
      env: {
        ...process.env,
        PATH: process.env.PATH,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Migrations completed successfully' }),
    };
  } catch (error) {
    console.error('Migration error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Migration failed', details: error.message }),
    };
  }
}; 