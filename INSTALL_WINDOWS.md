# Installing and Running on Windows

This guide explains how to install and run the Supapos POS desktop application on a Windows machine.

## What You Need

1. **Windows 10 or later** (64-bit)
2. **Node.js 18 or later** - [Download here](https://nodejs.org/)
3. The release files from the build

## Installation Methods

### Method 1: Using the Installer (Recommended)

If you have the **installer file** (`Supapos POS Setup x.x.x.exe`):

1. **Copy the installer** to your Windows machine
2. **Double-click** the `.exe` file to start the installation
3. **Follow the installation wizard**:
   - Choose installation directory (default is `C:\Users\<YourName>\AppData\Local\Programs\supapos-electron`)
   - Select whether to create desktop shortcut (recommended)
   - Select whether to create Start Menu shortcut (recommended)
4. **Click "Install"** and wait for installation to complete
5. **Launch the app**:
   - From the desktop shortcut (if created)
   - From Start Menu → "Supapos POS"
   - Or from the installation directory

### Method 2: Using the Unpacked Folder

If you have the **unpacked folder** (`win-unpacked`):

1. **Copy the entire `win-unpacked` folder** to your Windows machine
   - You can place it anywhere (e.g., `C:\Programs\SupaposPOS\`)

2. **Install Node.js** (if not already installed):
   - Download from [nodejs.org](https://nodejs.org/)
   - Install with default settings
   - Verify installation by opening Command Prompt and running:
     ```cmd
     node --version
     npm --version
     ```

3. **Navigate to the app directory**:
   ```cmd
   cd C:\path\to\win-unpacked
   ```

4. **Run the application**:
   - **Option A:** Double-click `Supapos POS.exe`
   - **Option B:** Run from Command Prompt:
     ```cmd
     "Supapos POS.exe"
     ```

## First Run

When you first run the application:

1. **The app will start** - it may take 10-30 seconds to initialize
2. **A window will open** showing the Next.js application
3. **The Next.js server starts automatically** in the background
4. **You'll see the login screen** or main application interface

## Troubleshooting

### App Won't Start

**Error: "Node.js is not installed"**
- Install Node.js 18+ from [nodejs.org](https://nodejs.org/)
- Restart your computer after installation
- Try running the app again

**Error: "Cannot find module" or "Missing dependencies"**
- The app should include all dependencies, but if you see this:
  1. Open Command Prompt in the app directory
  2. Run: `npm install` (if node_modules is missing)
  3. Or reinstall using the installer

**App starts but shows blank screen or error**
- Wait 30-60 seconds for the Next.js server to start
- Check if port 3000 is already in use:
  ```cmd
   netstat -ano | findstr :3000
   ```
- If port 3000 is in use, you may need to:
  - Close the application using port 3000
  - Or modify the port in the Electron app (requires rebuilding)

**"Windows protected your PC" warning**
- This is normal for unsigned applications
- Click "More info" → "Run anyway"
- To avoid this, the app needs to be code-signed (requires a certificate)

### Performance Issues

**App is slow to start**
- First launch takes longer (30-60 seconds)
- Subsequent launches should be faster (10-20 seconds)
- Ensure you have sufficient RAM (4GB+ recommended)

**App uses too much memory**
- The app includes a full Next.js server and Electron
- Normal usage: 200-500 MB RAM
- Close other applications if needed

## Running in Background

The application runs a local Next.js server. This is normal and required for the app to function.

- The server runs on `http://localhost:3000`
- It's only accessible from your local machine
- It automatically starts when you launch the app
- It automatically stops when you close the app

## Uninstallation

### If installed via installer:
1. Go to **Settings** → **Apps** → **Apps & features**
2. Find "Supapos POS"
3. Click **Uninstall**
4. Follow the prompts

### If using unpacked folder:
1. Simply delete the folder
2. Delete any shortcuts you created manually

## File Locations

### Installer Installation:
- **App files:** `C:\Users\<YourName>\AppData\Local\Programs\supapos-electron\`
- **User data:** `C:\Users\<YourName>\AppData\Roaming\supapos-electron\`

### Unpacked Folder:
- **App files:** Wherever you placed the `win-unpacked` folder
- **No user data stored** (unless configured)

## Network Requirements

The application needs network access to:
- Connect to your backend API (configured via environment variables)
- Download updates (if auto-update is enabled)

**Firewall:** Windows may ask for firewall permission on first run. Allow it.

## Support

If you encounter issues:
1. Check that Node.js is installed and in PATH
2. Verify the app files are complete (not corrupted)
3. Check Windows Event Viewer for detailed error messages
4. Ensure port 3000 is available
5. Try running as Administrator (right-click → Run as administrator)

## Next Steps

After installation:
1. Configure the backend API URL (if needed)
2. Set up user accounts
3. Start using the application!

