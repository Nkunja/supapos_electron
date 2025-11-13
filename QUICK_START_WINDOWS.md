# Quick Start - Windows Installation

## What You'll Find in the Release Folder

After building, the `release/` folder contains:

```
release/
├── Supapos POS Setup 1.0.0.exe    ← INSTALLER (if built on Windows)
└── win-unpacked/                   ← Unpacked app (works on any OS!)
    ├── Supapos POS.exe             ← Run this directly!
    ├── resources/
    └── ...
```

**Note:** If you built on macOS, you'll only have `win-unpacked` folder. This works perfectly - just copy the folder and run the .exe!

## Quick Installation Steps

### Option 1: Use the Installer (If Available) ⭐

**Only available if built on Windows!**

1. **Copy `Supapos POS Setup 1.0.0.exe`** to your Windows machine
2. **Double-click** the `.exe` file
3. **Follow the wizard** - click "Next" → "Install"
4. **Launch** from desktop shortcut or Start Menu

**Done!** The app is installed and ready to use.

### Option 2: Use the Unpacked Folder (Works on macOS Builds) ✅

**This is what you have if you built on macOS!**

1. **Copy the entire `win-unpacked` folder** to Windows
2. **Install Node.js** from [nodejs.org](https://nodejs.org/) (if not installed)
3. **Double-click `Supapos POS.exe`** inside the folder
4. **Create a shortcut** (right-click → Create shortcut) for easy access

**Done!** The app runs directly from the folder - no installation needed!

## Prerequisites

- ✅ **Windows 10/11** (64-bit)
- ✅ **Node.js 18+** - [Download](https://nodejs.org/)
  - Verify: Open Command Prompt → type `node --version`

## First Launch

- ⏱️ **First launch takes 30-60 seconds** (Next.js server starting)
- ⏱️ **Subsequent launches take 10-20 seconds**
- 🖥️ **Window will open** automatically when ready

## Troubleshooting

**"Windows protected your PC" warning?**
- Click "More info" → "Run anyway"
- Normal for unsigned apps

**App won't start?**
- Install Node.js 18+ from [nodejs.org](https://nodejs.org/)
- Restart computer after installing Node.js
- Try running as Administrator

**Blank screen?**
- Wait 30-60 seconds for server to start
- Check if port 3000 is in use

## Need More Help?

See `INSTALL_WINDOWS.md` for detailed instructions.

