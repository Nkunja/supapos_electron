# Standalone Electron Application

This Electron application is **completely independent** and contains its own copy of the Next.js application.

## How It Works

### During Development/Build

1. **Build Script** (`scripts/build-nextjs.js`):
   - Builds the Next.js app from `../Pharmacy-suite-frontend`
   - Ensures all dependencies are installed

2. **Copy Script** (`scripts/copy-nextjs.js`):
   - Copies the entire Next.js application into `app/nextjs-app/`
   - Excludes unnecessary files (`.git`, `.next/cache`, etc.)
   - Creates a complete, standalone copy

3. **Electron Main Process** (`src/main.ts`):
   - Looks for the Next.js app in `app/nextjs-app/` (local)
   - Starts the Next.js server from the bundled copy
   - No dependency on external paths

### After Building

- The `app/nextjs-app/` directory contains a complete Next.js application
- All files, dependencies, and configurations are included
- The Electron app can run without the original `Pharmacy-suite-frontend` directory
- The packaged installer includes everything needed

## Directory Structure

```
supapos_electron/
├── app/
│   └── nextjs-app/          # Complete Next.js app (auto-generated)
│       ├── .next/           # Built Next.js files
│       ├── app/             # Next.js app directory
│       ├── components/      # React components
│       ├── lib/             # Utilities
│       ├── node_modules/    # All dependencies
│       ├── package.json     # Next.js package.json
│       └── ...              # All other Next.js files
├── src/                     # Electron source code
├── scripts/                 # Build and copy scripts
└── ...
```

## Benefits

✅ **Complete Independence**: No need for the original Next.js source after building
✅ **Portable**: Can be moved to any location without breaking
✅ **Self-Contained**: All dependencies bundled together
✅ **Easy Distribution**: Single installer contains everything
✅ **Version Control**: The bundled app is in `.gitignore` (auto-generated)

## Updating the Next.js App

If you make changes to the Next.js app:

1. Update `../Pharmacy-suite-frontend`
2. Run `npm run copy:nextjs` to update the bundled copy
3. Or run `npm run build:win` which automatically copies it

## Important Notes

- The `app/nextjs-app/` directory is **auto-generated** - don't edit it directly
- Always edit the source in `../Pharmacy-suite-frontend` and then copy
- The directory is in `.gitignore` to avoid committing large files
- Environment variables should be set in the source before copying

