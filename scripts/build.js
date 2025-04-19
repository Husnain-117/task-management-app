// This script runs during the Netlify build process
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create the scripts directory if it doesn't exist
const scriptsDir = path.join(process.cwd(), 'scripts');
if (!fs.existsSync(scriptsDir)) {
  fs.mkdirSync(scriptsDir, { recursive: true });
}

// Generate Prisma client
console.log('Generating Prisma client...');
execSync('npx prisma generate', { stdio: 'inherit' });

// Run Next.js build
console.log('Building Next.js application...');
execSync('next build', { stdio: 'inherit' });

console.log('Build completed successfully!'); 