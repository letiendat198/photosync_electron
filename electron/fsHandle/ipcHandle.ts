import {ipcMain, dialog} from 'electron'

ipcMain.handle('fs:openFolder', async ()=> {
    console.log("fs:openFolder invoked")
    const {canceled, filePaths} = await dialog.showOpenDialog({properties: ["openDirectory"]})
    if (!canceled){
        console.log(filePaths[0])
        return filePaths[0]
    }
})