# Building Windows Installer on macOS

## Issue

When building Windows installers on macOS (especially Apple Silicon), you may encounter Wine compatibility errors. This is because electron-builder uses Wine to edit Windows executable metadata, and the Wine version may not be compatible with your Mac's CPU architecture.

## Solutions

### Option 1: Use the Unpacked Folder (Recommended for macOS)

When building on macOS, electron-builder will create a `win-unpacked` folder instead of an installer. **This works perfectly!**

1. The build creates `release/win-unpacked/` folder
2. Copy this entire folder to Windows
3. Run `Supapos POS.exe` directly
4. No installer needed - it works as-is!

**Note:** To create a proper installer (.exe), you need to build on Windows (see Option 2).

### Option 2: Build on Windows Machine

For the best results, build the Windows installer on an actual Windows machine:

1. Copy the entire `supapos_electron` directory to a Windows machine
2. Install Node.js 18+ on Windows
3. Run:
   ```bash
   npm install
   npm run build:win
   ```

### Option 3: Use GitHub Actions / CI/CD

Set up a GitHub Actions workflow to build Windows installers automatically:

```yaml
name: Build Windows Installer

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: |
          cd supapos_electron
          npm install
      - name: Build
        run: |
          cd supapos_electron
          npm run build:win
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: windows-installer
          path: supapos_electron/release/*.exe
```

### Option 4: Use Docker (Advanced)

You can use a Windows Docker container, but this is more complex and not recommended for most users.

## Current Configuration

The `package.json` has been configured with:
- `signAndEditExecutable: false` - Skips Wine-based executable editing
- `signDlls: false` - Skips DLL signing

**Important:** On macOS, the NSIS installer creation may fail due to Wine compatibility. However, the `win-unpacked` folder is created successfully and can be used directly on Windows - just copy the folder and run the .exe file!

## Notes

- The installer will still function correctly
- The executable will have default Windows metadata
- For production releases, consider building on Windows or using CI/CD
- Code signing (if needed) should be done on Windows

## Testing the Build

After building, you can test the unpacked app:
```bash
# This creates an unpacked directory without an installer
npm run pack
```

The unpacked app will be in `release/win-unpacked/` and can be tested on a Windows machine.

