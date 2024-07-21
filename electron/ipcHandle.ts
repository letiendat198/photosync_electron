import {ipcMain, dialog, BrowserWindow} from 'electron'
import installedFlow from './oauth/flow'
import storage from './oauth/storage'
import watch from './fs_handle/watch'
import hookEventWithUpload from './api_handle/uploadHook'
import createNotificationWindow from './notification'

var winRef: BrowserWindow|null = null
let componentUniqueKey = 0

function renderToMainIPC(){
    ipcMain.handle('fs:openFolder', async ()=> {
        console.log("fs:openFolder invoked")
        const {canceled, filePaths} = await dialog.showOpenDialog({properties: ["openDirectory"]})
        if (!canceled){
            console.log(filePaths[0])

            let watchList = await watch.getSimpleWatchList() // May race
            console.log(watchList)
            if (watchList.includes(filePaths[0])) return null

            hookEventWithUpload(filePaths[0])
            const pathDetails = {
                path: filePaths[0],
                key: componentUniqueKey++
            }
            return pathDetails
        }
        return null
    })

    ipcMain.on("event:folderStatusChange", (event, folderStatus, folderPath) => {
        console.log(folderPath, folderStatus)
        if (folderStatus == false){
            watch.stopWatcher(folderPath)
        }
    })

    ipcMain.handle('event:checkCachedSecret', async (event) => {
        console.log("event:checkCachedSecret")
        try {
            let clientDetails = await storage.loadClient()
            console.log(clientDetails)
            return clientDetails
        }
        catch(err){
            console.log(err)
            return null
        }
    })

    ipcMain.on("event:submitClient", (event, client_id, client_secret) => {
        console.log(client_id, client_secret)
        storage.storeClient(client_id, client_secret)
        installedFlow(client_id, client_secret)

    })
}

function mainToRenderIPC(channel: string, data: any){
    let allWindows = BrowserWindow.getAllWindows()
    // if (allWindows.length == 0){
    //     createNotificationWindow().then((win) => {
    //         win.webContents.send('route:notification')
    //         win.webContents.send(channel, data)
    //     })
    // }
    for (let window of allWindows){
        window.webContents.send(channel, data)
        if (window.getTitle() == "Notification"){
            window.show()
            let offset = 100
            let size: number[] = window.getSize()
            window.setSize(size[0],size[1]+offset)
            let pos: number[] = window.getPosition()
            window.setPosition(pos[0], pos[1]-offset)
        }
    }
}

const ipc = {
    mainToRenderIPC,
    renderToMainIPC,
}

export default ipc