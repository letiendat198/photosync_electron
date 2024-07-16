import { contextBridge, ipcRenderer } from 'electron'

console.log("preload file loaded")

declare global{
  interface Window{
    electronAPI: any
  }
  enum fsInvokeEvent{
    openFolder = "fs:openFolder"
  }
  enum renderEvent{
    folderStatusChanged = 'event:folderChanged'
  }
}

contextBridge.exposeInMainWorld('electronAPI', {
  openFolder: () => ipcRenderer.invoke(fsInvokeEvent.openFolder),
  onFolderCheckChange: () => ipcRenderer.send(renderEvent.folderStatusChanged)
})