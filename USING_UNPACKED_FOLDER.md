# Using the Unpacked Folder (No Installer Needed)

## What You Have

If you built on macOS, you'll have a `win-unpacked` folder instead of an installer. **This works perfectly fine!** You can distribute and use this folder directly.

## Installation on Windows

### Step 1: Copy the Folder

1. Copy the **entire `win-unpacked` folder** to your Windows machine
2. You can place it anywhere, for example:
   - `C:\Programs\SupaposPOS\`
   - `C:\Users\<YourName>\AppData\Local\SupaposPOS\`
   - Or any location you prefer

### Step 2: Install Node.js (If Not Already Installed)

1. Download Node.js 18+ from [nodejs.org](https://nodejs.org/)
2. Install with default settings
3. Verify installation:
   - Open Command Prompt
   - Type: `node --version`
   - Should show: `v18.x.x` or higher

### Step 3: Run the Application

1. Navigate to the `win-unpacked` folder
2. **Double-click `Supapos POS.exe`**
3. Wait 30-60 seconds for the app to start (first launch)
4. The application window will open automatically

## Creating a Shortcut

To make it easier to launch:

1. **Right-click** on `Supapos POS.exe`
2. Select **"Create shortcut"**
3. **Drag the shortcut** to your Desktop or Start Menu

## Advantages of Unpacked Folder

✅ **No installation needed** - Just copy and run
✅ **Portable** - Can be moved to different locations
✅ **Easy to update** - Just replace the folder
✅ **Works immediately** - No installer wizard needed

## Distribution

To distribute to clients:

1. **Zip the entire `win-unpacked` folder**
2. Send the zip file to clients
3. Clients extract and run `Supapos POS.exe`

**File size:** The folder is approximately 150-200 MB

## Troubleshooting

**"Windows protected your PC" warning?**
- Click "More info" → "Run anyway"
- This is normal for unsigned applications

**App won't start?**
- Ensure Node.js 18+ is installed
- Try running as Administrator (right-click → Run as administrator)

**Blank screen?**
- Wait 30-60 seconds for the Next.js server to start
- Check if port 3000 is available

## Next Steps

If you want a proper installer (.exe), you'll need to:
- Build on a Windows machine, OR
- Use the unpacked folder (which works just as well!)

