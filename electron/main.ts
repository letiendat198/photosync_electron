import { app, BrowserWindow, shell, dialog, ipcMain } from 'electron'
import path from 'node:path'
import oauth from './oauth/oauth'
import ipc from './ipcHandle'

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow

async function createWindow () {
    win = new BrowserWindow({
        title: 'Main window',
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(process.cwd(), 'dist-electron','preload.mjs'),
            nodeIntegration: false,
            nodeIntegrationInWorker: true,
            contextIsolation: true,
            sandbox: true
        }
    })
    if (app.isPackaged) {
        // win.removeMenu()
        win.loadFile('../dist/index.html')
    } else {
        // Vite's dev server
        win.loadURL('http://localhost:5173')
        // win.webContents.openDevTools()
    }
}

app.whenReady().then(() => { 
    ipc.renderToMainIPC()
    createWindow()
    ipc.passWinRef(win)
})

app.on('second-instance', () => {
    if (win) {
        // Focus on the main window if the user tried to open another
        if (win.isMinimized()) win.restore()
        win.focus()
    }
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length) {
        allWindows[0].focus()
    } 
    else {
        createWindow()
    }
})