const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SOURCE_DIR = path.join(__dirname, '../../Pharmacy-suite-frontend');
const TARGET_DIR = path.join(__dirname, '../app/nextjs-app');

// Directories and files to exclude
const EXCLUDE_PATTERNS = [
  '.git',
  '.next/cache',
  'node_modules/.cache',
  '.DS_Store',
  '*.log',
  '.env.local',
  '.env',
];

function shouldExclude(filePath) {
  const relativePath = path.relative(SOURCE_DIR, filePath);
  return EXCLUDE_PATTERNS.some(pattern => {
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace('*', '.*'));
      return regex.test(relativePath);
    }
    return relativePath.includes(pattern);
  });
}

function copyRecursive(src, dest) {
  const stats = fs.statSync(src);
  
  if (stats.isDirectory()) {
    if (shouldExclude(src)) {
      return;
    }
    
    // Create destination directory
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    // Copy contents
    const entries = fs.readdirSync(src);
    for (const entry of entries) {
      const srcPath = path.join(src, entry);
      const destPath = path.join(dest, entry);
      
      if (!shouldExclude(srcPath)) {
        copyRecursive(srcPath, destPath);
      }
    }
  } else {
    if (!shouldExclude(src)) {
      // Ensure parent directory exists
      const parentDir = path.dirname(dest);
      if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
      }
      fs.copyFileSync(src, dest);
    }
  }
}

function main() {
  console.log('Copying Next.js app to Electron app directory...');
  console.log(`Source: ${SOURCE_DIR}`);
  console.log(`Target: ${TARGET_DIR}`);
  
  // Check if source exists
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`Error: Source directory does not exist: ${SOURCE_DIR}`);
    process.exit(1);
  }
  
  // Check if Next.js app is built
  const nextBuildDir = path.join(SOURCE_DIR, '.next');
  if (!fs.existsSync(nextBuildDir)) {
    console.warn('Warning: Next.js app is not built. Building now...');
    try {
      execSync('npm run build', { 
        cwd: SOURCE_DIR, 
        stdio: 'inherit' 
      });
    } catch (error) {
      console.error('Error: Failed to build Next.js app');
      process.exit(1);
    }
  }
  
  // Ensure app directory exists
  const appDir = path.dirname(TARGET_DIR);
  if (!fs.existsSync(appDir)) {
    fs.mkdirSync(appDir, { recursive: true });
  }
  
  // Remove existing target directory
  if (fs.existsSync(TARGET_DIR)) {
    console.log('Removing existing app directory...');
    fs.rmSync(TARGET_DIR, { recursive: true, force: true });
  }
  
  // Copy files
  console.log('Copying files...');
  copyRecursive(SOURCE_DIR, TARGET_DIR);
  
  console.log('✓ Next.js app copied successfully!');
  console.log(`Location: ${TARGET_DIR}`);
}

main();

