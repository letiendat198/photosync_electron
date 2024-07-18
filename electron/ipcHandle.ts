import {ipcMain, dialog, BrowserWindow} from 'electron'
import installedFlow from './oauth/flow'
import storage from './oauth/storage'
import watch from './fs_handle/watch'
import hookEventWithUpload from './api_handle/uploadHook'

var winRef: BrowserWindow|null = null

function renderToMainIPC(){
    ipcMain.handle('fs:openFolder', async ()=> {
        console.log("fs:openFolder invoked")
        const {canceled, filePaths} = await dialog.showOpenDialog({properties: ["openDirectory"]})
        if (!canceled){
            console.log(filePaths[0])
            hookEventWithUpload(filePaths[0])
            return filePaths[0]
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

function passWinRef(win: BrowserWindow){
    winRef = win
}

function mainToRenderIPC(channel: string, data: any){
    if(winRef == null){
        console.log("No renderer reference found!")
        return
    }
    winRef.webContents.send(channel, data)
}

const ipc = {
    mainToRenderIPC,
    renderToMainIPC,
    passWinRef
}

export default ipc