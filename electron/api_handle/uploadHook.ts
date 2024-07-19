import watch from "../fs_handle/watch";
import photosAPI from "./photosAPI";
import storage from "../oauth/storage";
import oauth from "../oauth/oauth"
import fs from 'node:fs'
import ipc from "../ipcHandle";
import path from 'node:path'
import url from 'node:url'

let componentUniqueKey = 0

function hookEventWithUpload(watchPath: string){
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
                    ipc.mainToRenderIPC('event:fileUpload', fileDetails)
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
                    // Upload binary data and get upload token
                    let uploadToken = await photosAPI.requestUploadToken(tokenDetails.access_token, fileName, buffer)
                    // Create new media on Google Photos
                    photosAPI.uploadMedias(tokenDetails.access_token, [{
                        description: "Photosync",
                        simpleMediaItem: {
                            fileName: fileName,
                            uploadToken: uploadToken
                        }
                    }]).then((_) => {
                        console.log("Successfully uploaded to Google Photos")
                        let status = {
                            key: fileDetails.key,
                            status: "success"
                        }
                        ipc.mainToRenderIPC('event:fileUploadStatus', status)
                    }).catch(console.log)
                }
            })
        }
    })
}

export default hookEventWithUpload