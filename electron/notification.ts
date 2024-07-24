import { app, BrowserWindow, screen } from "electron"
import path from 'node:path'

var notificationWindow: BrowserWindow
let width = 400
let height = 45
let timer: NodeJS.Timeout | null = null

async function createNotificationWindow (preloadPath: string, indexPath: string): Promise<BrowserWindow> {
    let defaultScreen = screen.getPrimaryDisplay()
    let screenSize = defaultScreen.workAreaSize
    console.log(screenSize)

    notificationWindow = new BrowserWindow({
        title: 'Notification',
        alwaysOnTop: true,
        skipTaskbar: true,
        frame: false,
        width: 0,
        height: 0,
        webPreferences: {
            preload: preloadPath,
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true,
            webSecurity: false, // set to true for production
        }
    })
    

    notificationWindow.on('page-title-updated', (event) => {
        event.preventDefault()
    })    
    if (app.isPackaged) {
        // win.removeMenu()
        notificationWindow.loadFile(indexPath)
    } else {
        // Vite's dev server
        notificationWindow.loadURL('http://localhost:5173/')
    }
    return new Promise((resolve, reject) => {
        notificationWindow.on('ready-to-show', (event: any) => {
            notificationWindow.webContents.send('route:notification')
            // Need to route first then hide so that first entry not disappear
            notificationWindow.hide()
            notificationWindow.setPosition(screenSize.width-width,screenSize.height-height)
            notificationWindow.setSize(width, height)

            resolve(notificationWindow)
        })
    })
}

function resetNotificationWindow(){
    notificationWindow.setSize(width, height)
    let workArea = screen.getPrimaryDisplay().workAreaSize
    notificationWindow.setPosition(workArea.width-width, workArea.height-height)
}

function timelimitedShow(){
    // If a timer already exists, cancel it and count again
    if (timer) {
        console.log("New entry added, count again")
        clearTimeout(timer)
    }
    notificationWindow.show()
    timer = setTimeout(() => {
        notificationWindow.hide()
    }, 10000)
}

function expandNotificationByOne(){
    timelimitedShow()
    let offset = 103
    let size: number[] = notificationWindow.getSize()
    if (size[1]>offset*3) return
    
    notificationWindow.setSize(size[0],size[1]+offset)
    let pos: number[] = notificationWindow.getPosition()
    notificationWindow.setPosition(pos[0], pos[1]-offset) 
}

const notification = {
    createNotificationWindow,
    resetNotificationWindow,
    expandNotificationByOne
}

export default notification