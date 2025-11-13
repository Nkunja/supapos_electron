import { app, BrowserWindow, shell } from 'electron';
import * as path from 'path';
import { spawn, ChildProcess } from 'child_process';
import * as fs from 'fs';
import * as http from 'http';

let mainWindow: BrowserWindow | null = null;
let nextProcess: ChildProcess | null = null;
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
const PORT = 3000;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
    },
    icon: path.join(__dirname, '../build/icon.png'),
    show: false,
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
  });

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
    if (isDev) {
      mainWindow?.webContents.openDevTools();
    }
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }: { url: string }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Load the Next.js app
  const startUrl = isDev 
    ? `http://localhost:${PORT}` 
    : `http://localhost:${PORT}`;

  mainWindow.loadURL(startUrl);

  // Retry loading if Next.js server isn't ready
  mainWindow.webContents.on('did-fail-load', () => {
    setTimeout(() => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.loadURL(startUrl);
      }
    }, 1000);
  });
}

function startNextServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    let nextAppPath: string;
    
    if (isDev) {
      // In development, use the local app directory
      nextAppPath = path.join(__dirname, '../app/nextjs-app');
      
      // Fallback to source if local copy doesn't exist
      if (!fs.existsSync(nextAppPath)) {
        nextAppPath = path.join(__dirname, '../../Pharmacy-suite-frontend');
      }
    } else {
      // In production, the app is bundled in resources/app/nextjs-app
      nextAppPath = path.join(process.resourcesPath, 'app', 'nextjs-app');
      
      // Fallback for different packaging scenarios
      if (!fs.existsSync(nextAppPath)) {
        nextAppPath = path.join(app.getAppPath(), '..', 'app', 'nextjs-app');
      }
      if (!fs.existsSync(nextAppPath)) {
        nextAppPath = path.join(process.execPath, '..', 'resources', 'app', 'nextjs-app');
      }
      if (!fs.existsSync(nextAppPath)) {
        nextAppPath = path.join(__dirname, '../app/nextjs-app');
      }
    }

    // Check if Next.js app exists
    if (!fs.existsSync(nextAppPath)) {
      reject(new Error(`Next.js app not found at: ${nextAppPath}`));
      return;
    }

    const packageJsonPath = path.join(nextAppPath, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      reject(new Error(`package.json not found at: ${packageJsonPath}`));
      return;
    }

    // Determine the command to run
    const command = isDev ? 'npm' : process.platform === 'win32' ? 'npm.cmd' : 'npm';
    const args = isDev 
      ? ['run', 'dev', '--', '--port', PORT.toString()]
      : ['run', 'start', '--', '--port', PORT.toString()];

    console.log(`Starting Next.js server at: ${nextAppPath}`);
    console.log(`Command: ${command} ${args.join(' ')}`);

    nextProcess = spawn(command, args, {
      cwd: nextAppPath,
      stdio: 'inherit',
      shell: true,
      env: {
        ...process.env,
        PORT: PORT.toString(),
        NODE_ENV: isDev ? 'development' : 'production',
      },
    });

    nextProcess.on('error', (error) => {
      console.error('Failed to start Next.js server:', error);
      reject(error);
    });

    // Wait for server to be ready
    const checkServer = setInterval(() => {
      const req = http.get(`http://localhost:${PORT}`, (res: http.IncomingMessage) => {
        if (res.statusCode === 200 || res.statusCode === 404) {
          clearInterval(checkServer);
          console.log('Next.js server is ready!');
          resolve();
        }
      });
      req.on('error', (_error: Error) => {
        // Server not ready yet, continue waiting
      });
      req.setTimeout(1000, () => {
        req.destroy();
      });
    }, 1000);

    // Timeout after 60 seconds
    setTimeout(() => {
      clearInterval(checkServer);
      if (nextProcess && nextProcess.exitCode === null) {
        resolve(); // Assume it's running even if we can't verify
      } else {
        reject(new Error('Next.js server failed to start within 60 seconds'));
      }
    }, 60000);
  });
}

function stopNextServer() {
  if (nextProcess) {
    console.log('Stopping Next.js server...');
    if (process.platform === 'win32') {
      spawn('taskkill', ['/pid', nextProcess.pid!.toString(), '/f', '/t']);
    } else {
      nextProcess.kill('SIGTERM');
    }
    nextProcess = null;
  }
}

// App event handlers
app.whenReady().then(async () => {
  try {
    await startNextServer();
    createWindow();
  } catch (error) {
    console.error('Failed to start application:', error);
    app.quit();
  }
});

app.on('window-all-closed', () => {
  stopNextServer();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('before-quit', () => {
  stopNextServer();
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

