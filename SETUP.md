# Quick Setup Guide

## Initial Setup

1. **Install dependencies:**
   ```bash
   cd supapos_electron
   npm install
   ```

2. **Copy the Next.js application (this makes it standalone):**
   ```bash
   npm run copy:nextjs
   ```
   
   This will:
   - Build the Next.js app from `../Pharmacy-suite-frontend`
   - Copy it into `app/nextjs-app/` directory
   - Make the Electron app completely independent

3. **Add application icon (optional but recommended):**
   - Create or obtain a `.ico` file for Windows
   - Place it at `build/icon.ico`
   - Minimum size: 256x256 pixels
   - If you don't have an icon, the app will still build but without a custom icon

**Note:** The Next.js app is now bundled within the Electron app. You don't need the original `Pharmacy-suite-frontend` directory after building.

## Development

Run the app in development mode:
```bash
npm run dev
```

This will:
- Start the Next.js dev server
- Launch Electron
- Open DevTools automatically

## Building for Windows

To create a Windows installer:

```bash
npm run build:win
```

The installer will be created in the `release/` directory.

## Important Notes

### Environment Variables
The Next.js app requires environment variables for the backend API. You can set these in:
- `../Pharmacy-suite-frontend/.env.local` (before copying)
- Or `app/nextjs-app/.env.local` (after copying)

```
NEXT_PUBLIC_API_BASE_URL=http://your-backend-api-url/api
```

**Note:** If you update environment variables, you'll need to run `npm run copy:nextjs` again to update the bundled app.

### Node.js Requirement
The packaged application requires Node.js to be installed on the target Windows machine. The Next.js server runs locally within the Electron app.

### Backend API
The application connects to a backend API. Ensure:
- The API URL is correctly configured in environment variables
- The target machine has network access to the API (if it's hosted remotely)
- Or configure the API to run locally on the client machine

## Troubleshooting

### "Next.js app not found" error
- Run `npm run copy:nextjs` to copy the Next.js app into the Electron app
- Ensure the `app/nextjs-app/` directory exists and contains the Next.js application
- Check that the Next.js app was built successfully before copying

### Port 3000 already in use
- Change the PORT constant in `src/main.ts` to a different port
- Or stop the process using port 3000

### Build fails
- Make sure all dependencies are installed in both projects
- Check that you have sufficient disk space
- Verify Node.js version is 18 or higher

### App won't start after installation
- Ensure Node.js is installed on the target machine
- Check Windows Event Viewer for detailed error messages
- Verify the Next.js app files are included in the installer

