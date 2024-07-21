import { contextBridge, ipcRenderer } from 'electron'

console.log("preload file loaded")

declare global{
  interface Window{
    electronAPI: any
  }
}

type modalTextUpdateCallack = (text: string) => void
type setupStatusCallback = () => void
type fileUploadCallback = (fileDetails: any) => void

contextBridge.exposeInMainWorld('electronAPI', {
  openFolder: () => ipcRenderer.invoke("fs:openFolder"),
  folderStatusChange: (status: boolean, path: string) => ipcRenderer.send("event:folderStatusChange", status, path),
  checkCachedSecret: () => ipcRenderer.invoke("event:checkCachedSecret"),
  submitClientDetails: (client_id: string, client_secret: string) => ipcRenderer.send("event:submitClient", client_id, client_secret),
 
  onModalTextUpdate: (callback: modalTextUpdateCallack) => ipcRenderer.on('event:modalTextUpdate', (event, value) => callback(value)),
  onSetupComplete: (callback: setupStatusCallback) => ipcRenderer.on('event:setupComplete', (event, value) => callback()),
  onSetupFail: (callback: setupStatusCallback) => ipcRenderer.on('event:setupFail', (event, value) => callback()),

  onFileUpload: (callback: fileUploadCallback) => ipcRenderer.on('event:fileUpload', (event, value) => callback(value)),
  onFileUploadStatus: (callback: fileUploadCallback) => ipcRenderer.on('event:fileUploadStatus', (event, value) => callback(value)),

  onRouteSetup: (callback: () => void) => ipcRenderer.on('route:setup', (event) => callback()),
  onRouteNotification: (callback: () => void) => ipcRenderer.on('route:notification', (event) => callback()),

  removeListenerForChannel: (channel: string) => ipcRenderer.removeAllListeners(channel)
})