import { app, BrowserWindow, Tray, Menu } from 'electron'
import path from 'node:path'
import ipc from './ipcHandle'
import notification from './notification'
import watch from './fs_handle/watch'
import hookEventWithUpload from './api_handle/uploadHook'
import storage from './oauth/storage'


declare global{
    var syncEnabled: boolean
}

if (!app.requestSingleInstanceLock()) {
    console.log("Another instance of this app is already running. Please close it")
    app.quit()
    process.exit(0)
}

let win: BrowserWindow
let tray: Tray

let preloadPath = app.isPackaged?path.join(process.cwd(), "resources", "app.asar", "dist-electron", "preload.mjs")
:path.join(process.cwd(), "dist-electron", "preload.mjs")
let indexPath = app.isPackaged?path.join(process.cwd(), "resources", "app.asar", "dist", "index.html")
:path.join(process.cwd(), "dist", "index.html")

async function createWindow () {
    win = new BrowserWindow({
        title: 'Photosync Electron',
        width: 1000,
        height: 600,
        webPreferences: {
            preload: preloadPath,
            nodeIntegration: false,
            nodeIntegrationInWorker: true,
            contextIsolation: true,
            sandbox: true,
            webSecurity: false, // set to true for production
        }
    })

    win.on('ready-to-show', () => {
        storage.loadClient().catch(() => {
            win.webContents.send('route:setup')
        })
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
        win.loadFile(indexPath)
    } else {
        // Vite's dev server
        win.loadURL('http://localhost:5173')
        // win.webContents.openDevTools()
    }
}

app.whenReady().then(() => { 
    globalThis.syncEnabled = true

    // Setup tray icon
    let on_image = path.join(process.cwd(), "public", "image_on.ico")
    let off_image = path.join(process.cwd(), "public", "image_off.ico")
    tray = new Tray(on_image)
    tray.setToolTip("Photosync: ON")
    const contextMenu = Menu.buildFromTemplate([
        {label: "Open", type: "normal", click: () => {
            if(win){
               win.show() 
               win.focus
            } 
        }},
        {type:"separator"},
        {label: "Exit", type: "normal", click: () => app.exit()}
    ])

    tray.setContextMenu(contextMenu)
    tray.on('click', (event) => {    
        globalThis.syncEnabled = !globalThis.syncEnabled
        tray.setImage(globalThis.syncEnabled?on_image:off_image)
        tray.setToolTip("Photosync: ".concat(globalThis.syncEnabled?"ON":"OFF"))
    })

    // Load watch list from disk
    watch.loadFromJson().then((watchList) => {
        for (let folder of watchList){
            hookEventWithUpload(folder)
        }
    }).catch((err) => console.log(err))

    ipc.renderToMainIPC()
    notification.createNotificationWindow(preloadPath, indexPath)
    createWindow()
})

app.on('second-instance', () => {
    if (win) {
        // Focus on the main window if the user tried to open another
        if (win.isMinimized()) win.restore()
        win.focus()
    }
})