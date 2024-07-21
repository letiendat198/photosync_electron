import { app, BrowserWindow, screen } from "electron"
import path from 'node:path'

async function createNotificationWindow (): Promise<BrowserWindow> {
    let defaultScreen = screen.getPrimaryDisplay()
    let screenSize = defaultScreen.workAreaSize
    console.log(screenSize)

    let width = 400
    let height = 50

    let win = new BrowserWindow({
        title: 'Notification',
        frame: false,
        width: 0,
        height: 0,
        webPreferences: {
            preload: path.join(process.cwd(), 'dist-electron','preload.mjs'),
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true,
            webSecurity: false, // set to true for production
        }
    })
    win.hide()
    win.setPosition(screenSize.width-width,screenSize.height-height)
    win.setSize(width, height)
    win.on('page-title-updated', (event) => {
        event.preventDefault()
    })    
    if (app.isPackaged) {
        // win.removeMenu()
        win.loadFile('../dist/index.html')
    } else {
        // Vite's dev server
        win.loadURL('http://localhost:5173/#/notification')
    }
    return new Promise((resolve, reject) => {
        win.on('ready-to-show', (event: any) => {
            resolve(win)
        })
    })
}

export default createNotificationWindow