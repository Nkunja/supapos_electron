const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const NEXTJS_SOURCE = path.join(__dirname, '../../Pharmacy-suite-frontend');

function main() {
  console.log('Building Next.js application...');
  console.log(`Directory: ${NEXTJS_SOURCE}`);
  
  if (!fs.existsSync(NEXTJS_SOURCE)) {
    console.error(`Error: Next.js source directory does not exist: ${NEXTJS_SOURCE}`);
    process.exit(1);
  }
  
  // Check if node_modules exists, if not install
  const nodeModulesPath = path.join(NEXTJS_SOURCE, 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    console.log('Installing Next.js dependencies...');
    try {
      execSync('npm install', { 
        cwd: NEXTJS_SOURCE, 
        stdio: 'inherit' 
      });
    } catch (error) {
      console.error('Error: Failed to install dependencies');
      process.exit(1);
    }
  }
  
  // Build Next.js app
  console.log('Building Next.js app...');
  try {
    execSync('npm run build', { 
      cwd: NEXTJS_SOURCE, 
      stdio: 'inherit' 
    });
    console.log('✓ Next.js app built successfully!');
  } catch (error) {
    console.error('Error: Failed to build Next.js app');
    process.exit(1);
  }
}

main();

