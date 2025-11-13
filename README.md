# Supapos Electron Desktop Application

This is a **standalone** Electron wrapper for the Pharmacy Suite POS Next.js application, designed to run as a desktop application on Windows. The Next.js application is bundled within this Electron app, making it completely independent.

## Prerequisites

- Node.js 18+ and npm
- Access to the source Next.js application (`../Pharmacy-suite-frontend`)
- Windows machine for building Windows installers (or use cross-platform build tools)

## Setup

1. Install dependencies:
```bash
cd supapos_electron
npm install
```

2. The Next.js app will be automatically copied and built when you run build commands. For the first time, you can manually copy it:
```bash
npm run copy:nextjs
```

**Note:** The Next.js app is copied into `app/nextjs-app/` directory, making this Electron app completely standalone.

## Development

To run the app in development mode:

```bash
npm run dev
```

This will:
- Start the Next.js dev server
- Launch the Electron app
- Open DevTools automatically

## Building for Windows

To build a Windows installer:

```bash
npm run build:win
```

This will:
1. Build the Next.js application
2. Copy it into the Electron app (standalone)
3. Compile the Electron TypeScript code
4. Package everything into a Windows installer (.exe)

The installer will be created in the `release/` directory.

### Building on macOS

If you're building Windows installers on macOS (especially Apple Silicon), the build configuration has been set to skip Wine-based operations to avoid compatibility issues. The installer will still work correctly.

**Note:** For production releases, consider building on a Windows machine or using CI/CD for the best results. See `BUILD_WINDOWS.md` for more details.

## Production Build

For a complete production build:

```bash
npm run dist
```

## Configuration

### Environment Variables

The Next.js app uses environment variables for API configuration. Make sure to set these in the Next.js app's `.env.local` file:

- `NEXT_PUBLIC_API_BASE_URL` - The backend API URL

### Icon

Place your application icon files in the `build/` directory:
- `icon.ico` - For Windows
- `icon.png` - For macOS/Linux (optional)

## Project Structure

```
supapos_electron/
├── src/
│   ├── main.ts          # Electron main process
│   └── preload.ts       # Preload script for security
├── scripts/
│   ├── build-nextjs.js  # Script to build Next.js app
│   └── copy-nextjs.js   # Script to copy Next.js app locally
├── app/
│   └── nextjs-app/      # Local copy of Next.js application (auto-generated)
├── build/               # Build resources (icons, etc.)
├── dist/                # Compiled TypeScript output
├── release/             # Built installers
├── package.json
├── tsconfig.json
└── README.md
```

**Important:** The `app/nextjs-app/` directory contains a complete copy of the Next.js application and is automatically generated. It's included in `.gitignore` and will be created during the build process.

## How It Works

1. The Next.js application is copied into `app/nextjs-app/` directory (standalone)
2. The Electron main process starts a local Next.js server from the bundled app
3. The Electron window loads the Next.js app from `http://localhost:3000`
4. All Next.js API routes and functionality work as normal
5. The app is packaged with all dependencies for offline installation
6. **The Electron app is completely independent** - it doesn't require the original Next.js source directory after building

## Troubleshooting

### Next.js server fails to start
- Ensure the Next.js app is built: `cd ../Pharmacy-suite-frontend && npm run build`
- Check that port 3000 is not in use
- Verify Node.js version is 18+

### Build fails
- Make sure all dependencies are installed in both projects
- Check that the Next.js app builds successfully first
- Ensure you have sufficient disk space for the build
- **Windows build on macOS:** If you encounter Wine errors, the configuration should handle this automatically. See `BUILD_WINDOWS.md` for troubleshooting

### App won't start after installation
- Check Windows Event Viewer for errors
- Verify the Next.js app files are included in the installer
- Ensure Node.js runtime is available (or use a bundled version)

## Installation on Windows

After building, you'll find the installer in the `release/` folder:

1. **Copy `Supapos POS Setup x.x.x.exe`** to your Windows machine
2. **Double-click** to install
3. **Launch** from desktop shortcut or Start Menu

**Prerequisites:**
- Windows 10/11 (64-bit)
- Node.js 18+ ([Download](https://nodejs.org/))

See `INSTALL_WINDOWS.md` for detailed installation instructions and `QUICK_START_WINDOWS.md` for a quick reference.

## Notes

- The app runs the Next.js server locally, so it requires Node.js to be installed on the target machine
- For a fully standalone app without Node.js requirement, consider using `electron-builder` with `asar` packaging
- The backend API must be accessible from the client machine (configure via environment variables)

