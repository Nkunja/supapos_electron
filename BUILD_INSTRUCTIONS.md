# Build Instructions for Windows

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] npm installed
- [ ] Next.js app dependencies installed
- [ ] Next.js app built successfully
- [ ] Application icon prepared (optional)

## Step-by-Step Build Process

### 1. Install Electron Dependencies

```bash
cd supapos_electron
npm install
```

### 2. Configure Environment Variables

Create or update `../Pharmacy-suite-frontend/.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://your-backend-api-url/api
```

Replace `your-backend-api-url` with your actual backend API URL.

**Note:** These will be copied into the bundled app automatically.

### 3. Add Application Icon (Recommended)

1. Create or obtain a Windows `.ico` file
2. Minimum size: 256x256 pixels
3. Place it at: `build/icon.ico`

If you don't have an icon, the build will still work but use the default Electron icon.

### 4. Build the Electron Application

For Windows installer:

```bash
npm run build:win
```

This will automatically:
1. Build the Next.js app from `../Pharmacy-suite-frontend`
2. Copy the Next.js app into `app/nextjs-app/` (making it standalone)
3. Compile TypeScript files
4. Package everything into a Windows installer
5. Create the installer in `release/` directory

**The Electron app is now completely standalone** - it contains its own copy of the Next.js application.

### 6. Distribute the Installer

The installer will be located at:
```
release/Pharmacy Suite POS Setup x.x.x.exe
```

You can distribute this `.exe` file to your clients for installation.

## Installation on Client Machine

1. Run the installer `.exe` file
2. Follow the installation wizard
3. Choose installation directory (optional)
4. The app will be installed with desktop and Start Menu shortcuts
5. Launch the app from the shortcut

## Requirements on Client Machine

- **Node.js 18+** must be installed
- Network access to the backend API (if API is hosted remotely)
- Sufficient disk space (approximately 500MB+ for the app and dependencies)

## Troubleshooting Build Issues

### Build fails with "Next.js app not found"
- The build process automatically copies the Next.js app, but if it fails:
  - Manually run: `npm run copy:nextjs`
  - Ensure `../Pharmacy-suite-frontend` exists and is built
  - Check that `app/nextjs-app/` directory is created after copying

### TypeScript compilation errors
- Run `npm install` to ensure all type definitions are installed
- Check that `@types/node` is installed

### Electron download fails
- Check your internet connection
- The `.npmrc` file includes a mirror URL for faster downloads
- You can manually download Electron if needed

### Installer creation fails
- Ensure you have write permissions in the `release/` directory
- Check available disk space
- On Windows, ensure you're running the command as Administrator if needed

## Advanced Configuration

### Changing the Port

Edit `src/main.ts` and change the `PORT` constant:

```typescript
const PORT = 3000; // Change to your preferred port
```

### Customizing the Installer

Edit the `build` section in `package.json` to customize:
- App ID
- Product name
- Installer options
- Icon paths

### Standalone Build (No Node.js Required)

For a fully standalone build that doesn't require Node.js on the client machine, you would need to:
1. Bundle Node.js with the application
2. Use `electron-builder` with additional configuration
3. This significantly increases the installer size (200MB+)

The current setup requires Node.js to be installed separately, which keeps the installer smaller.

## Testing the Build

Before distributing:

1. Install the built application on a test Windows machine
2. Verify the app launches correctly
3. Test all major features
4. Verify API connectivity
5. Check that the Next.js server starts automatically

## Support

If you encounter issues:
1. Check the console output when launching the app
2. Review Windows Event Viewer for errors
3. Verify all prerequisites are met
4. Check that the Next.js app runs independently

