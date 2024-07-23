import { app, BrowserWindow, shell, dialog, ipcMain, Tray, Menu } from 'electron'
import path from 'node:path'
import oauth from './oauth/oauth'
import ipc from './ipcHandle'
import notification from './notification'
import "../public/image.ico"

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow
let tray: Tray

async function createWindow () {
    win = new BrowserWindow({
        title: 'Photosync Electron',
        width: 1000,
        height: 600,
        webPreferences: {
            preload: path.join(process.cwd(), 'dist-electron','preload.mjs'),
            nodeIntegration: false,
            nodeIntegrationInWorker: true,
            contextIsolation: true,
            sandbox: true,
            webSecurity: false, // set to true for production
        }
    })

    win.on('page-title-updated', (event) => {
        event.preventDefault()
    })
    win.on('close', (event) => {
        event.preventDefault()
        win.hide()
    })

    if (app.isPackaged) {
        // win.removeMenu()
        win.loadFile('../dist/index.html')
    } else {
        // Vite's dev server
        win.loadURL('http://localhost:5173')
        win.webContents.openDevTools()
    }
}

app.whenReady().then(() => { 
    tray = new Tray(path.join(process.cwd(), "public/image.ico"))
    const contextMenu = Menu.buildFromTemplate([
        {label: "Open", type: "normal", click: () => {
            if(win){
               win.show() 
               win.focus
            } 
        }},
        {label: "Exit", type: "normal", click: () => app.exit()}
    ])

    tray.setContextMenu(contextMenu)

    ipc.renderToMainIPC()
    notification.createNotificationWindow()
    createWindow()
})

app.on('second-instance', () => {
    if (win) {
        // Focus on the main window if the user tried to open another
        if (win.isMinimized()) win.restore()
        win.focus()
    }
})

app.on('window-all-closed', () => {
    // if (process.platform !== 'darwin') app.quit()
})

// app.on('activate', () => {
//     const allWindows = BrowserWindow.getAllWindows()
//     if (allWindows.length==0 || (allWindows.length==1 && allWindows[0].getTitle()=="Notification")){
//         if (allWindows.length==0) notification.createNotificationWindow()
//         createWindow()
//     }
//     else{
//         for (let window of allWindows){
//             if (window.getTitle()!="Notification"){
//                 window.focus()
//             }
//         }
//     }
// })