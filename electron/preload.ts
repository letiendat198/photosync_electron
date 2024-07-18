import { contextBridge, ipcRenderer } from 'electron'

console.log("preload file loaded")

declare global{
  interface Window{
    electronAPI: any
  }
}

type modalTextUpdateCallack = (text: string) => void
type setupCompleteCallback = () => void

contextBridge.exposeInMainWorld('electronAPI', {
  openFolder: () => ipcRenderer.invoke("fs:openFolder"),
  folderStatusChange: (status: boolean, path: string) => ipcRenderer.send("event:folderStatusChange", status, path),
  checkCachedSecret: () => ipcRenderer.invoke("event:checkCachedSecret"),
  submitClientDetails: (client_id: string, client_secret: string) => ipcRenderer.send("event:submitClient", client_id, client_secret),
 
  onModalTextUpdate: (callback: modalTextUpdateCallack) => ipcRenderer.on('event:modalTextUpdate', (event, value) => callback(value)),
  onSetupComplete: (callback: setupCompleteCallback) => ipcRenderer.on('event:setupComplete', (event, value) => callback()),
})