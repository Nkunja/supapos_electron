# Building on macOS - Important Notes

## NSIS Installer Limitation

**NSIS (Nullsoft Scriptable Install System) installers cannot be created on macOS** due to architecture compatibility issues. This is a known limitation when building Windows installers on macOS.

## What Works on macOS

✅ **Unpacked Folder** - This works perfectly!
- The `win-unpacked` folder is created successfully
- Contains a fully functional Windows application
- Can be used directly on Windows (just copy and run)

❌ **NSIS Installer** - Does NOT work on macOS
- The installer creation fails with architecture errors
- This is expected and normal

## Solution: Use the Unpacked Folder

The build configuration has been updated to **only create the unpacked folder** when building on macOS. This is actually better because:

1. ✅ **Works immediately** - No installer needed
2. ✅ **Portable** - Can be moved anywhere
3. ✅ **Easier to distribute** - Just zip the folder
4. ✅ **No installation required** - Run directly

## Build Commands

### Default (Creates unpacked folder only)
```bash
npm run build:win
```

This creates `release/win-unpacked/` which is ready to use!

### If You Need an Installer

To create a proper `.exe` installer, you **must build on Windows**:

1. Copy the `supapos_electron` folder to a Windows machine
2. Run:
   ```bash
   npm install
   npm run build:win:installer
   ```
3. This will create `Supapos POS Setup x.x.x.exe`

## Using the Unpacked Folder

1. **Copy** the entire `win-unpacked` folder to Windows
2. **Run** `Supapos POS.exe` directly
3. **Create a shortcut** for easy access (right-click → Create shortcut)

See `USING_UNPACKED_FOLDER.md` for detailed instructions.

## Summary

- ✅ **macOS builds create unpacked folders** (works great!)
- ❌ **macOS cannot create NSIS installers** (architecture limitation)
- ✅ **Unpacked folder works perfectly** on Windows
- ✅ **For installers, build on Windows** or use CI/CD

The unpacked folder is actually more convenient for distribution - just zip it and send it to clients!

