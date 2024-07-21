import watch from "../fs_handle/watch";
import photosAPI from "./photosAPI";
import storage from "../oauth/storage";
import oauth from "../oauth/oauth"
import fs from 'node:fs'
import ipc from "../ipcHandle";
import path from 'node:path'
import url from 'node:url'
import fsPromise from "../fs_handle/fsPromise";

let componentUniqueKey = 0

function hookEventWithUpload(watchPath: string){
    if (timer==null) pollUploadQueue()
    watch.startWatcher(watchPath, (event, fileName) => {
        // On file event in watched folder
        if (event == 'rename' && fileName!=null){
            console.log("Event rename happened for file", fileName)
            fs.readFile(path.join(watchPath, fileName), async (err, buffer) => {
                if (err){
                    console.log("Probably false alert:",err)
                }
                else{
                    let fileDetails = {
                        name: fileName,
                        size: (buffer.byteLength / 1024**2).toFixed(2).toString() + "MB",
                        uploadTime: new Date().toISOString().split("T")[0],
                        pathURL: url.pathToFileURL(path.join(watchPath, fileName)).href,
                        key: componentUniqueKey++
                    }
                    console.log(fileDetails)
                    
                    queueFileForUpload(fileDetails)
                }
            })
        }
    })
}

interface mediaItem {
    description: string,
    simpleMediaItem: {
        fileName: string,
        uploadToken: string
    }
}
interface fileDetails{
    name: string,
    size: string,
    uploadTime: string,
    pathURL: string,
    key: number
}
interface uploadKeyLookup{
    [uploadToken: string]: number
}

var fileUploadQueue: fileDetails[] = []
var fileUploadQueueLock = false
var timer: NodeJS.Timeout | null = null

function queueFileForUpload(fileDetails: fileDetails): boolean{
    if (!fileUploadQueueLock) {
        fileUploadQueue.push(fileDetails)
        return true
    }
    return false
}

function pollUploadQueue(){
    timer = setInterval(async () => {
        if (fileUploadQueue.length == 0 || fileUploadQueueLock) return
        console.log("Current queue: ", fileUploadQueue.length)
        fileUploadQueueLock = true

        let tokenDetails = await getAccessTokenAndRefresh()

        let mediaItems: mediaItem[] = []
        let uploadKey: uploadKeyLookup = {"": -1} 

        for (let fileDetails of fileUploadQueue){       
            ipc.mainToRenderIPC('event:fileUpload', fileDetails)
            let buffer = await fsPromise.readFilePromise(url.fileURLToPath(fileDetails.pathURL))
            if (buffer != null){
                let uploadToken = await photosAPI.requestUploadToken(tokenDetails.access_token, fileDetails.name, buffer)
                let newMediaItem: mediaItem = {
                    description: 'Photosync',
                    simpleMediaItem: {
                        fileName: fileDetails.name,
                        uploadToken: uploadToken
                    }
                }
                mediaItems.push(newMediaItem)  
                uploadKey[uploadToken] = fileDetails.key  
            }
        }
        photosAPI.uploadMedias(tokenDetails.access_token, mediaItems).then((res) => {
            for (let mediaResult of res.newMediaItemResults){
                if (mediaResult.status.code == undefined){
                    console.log("Successfully uploaded: ", uploadKey[mediaResult.uploadToken])
                    ipc.mainToRenderIPC('event:fileUploadStatus', {
                        key: uploadKey[mediaResult.uploadToken], 
                        status: "success"
                    })
                }
                else{
                    console.log("Failed to upload %d with reason: ", uploadKey[mediaResult.uploadToken], mediaResult.status.message)
                    ipc.mainToRenderIPC('event:fileUploadStatus', {
                        key: uploadKey[res.uploadToken], 
                        status: "failed"
                    })
                }
            }

            fileUploadQueue = []
            fileUploadQueueLock = false
        }).catch((err) => {
            console.log("Failed to upload all items to Google Photos:",err)
            for (let fileDetails of fileUploadQueue){
                ipc.mainToRenderIPC('event:fileUploadStatus', {
                    key: fileDetails.key, 
                    status: "failed"
                })
            }
            fileUploadQueue = []
            fileUploadQueueLock = false
        })
        // fileUploadQueue = []
        // fileUploadQueueLock = false
    }, 5000)
}

async function getAccessTokenAndRefresh(){
    // Load access token
    let tokenDetails = await storage.loadAccessToken()
    // Check access token expiry status
    if (Math.round(Date.now()/1000) >= tokenDetails.expires_in){
        console.log("access_token expired, refreshing")
        // Refresh access token if expired
        let clientDetails = await storage.loadClient()
        tokenDetails = await oauth.refreshToken(clientDetails.client_id, 
            clientDetails.client_secret, tokenDetails.refresh_token)
        // Store new access token
        storage.storeAccessToken(tokenDetails)
    }
    return tokenDetails
}

export default hookEventWithUpload