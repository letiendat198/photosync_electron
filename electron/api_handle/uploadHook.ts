import watch from "../fs_handle/watch";
import photosAPI from "./photosAPI";
import storage from "../oauth/storage";
import oauth from "../oauth/oauth"
import fs from 'node:fs'
import ipc from "../ipcHandle";
import path from 'node:path'

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
                    let tokenDetails = await storage.loadAccessToken()
                    if (Math.round(Date.now()/1000) >= tokenDetails.expires_in){
                        console.log("access_token expired, refreshing")
                        let clientDetails = await storage.loadClient()
                        tokenDetails = await oauth.refreshToken(clientDetails.client_id, 
                            clientDetails.client_secret, tokenDetails.refresh_token)
                        storage.storeAccessToken(tokenDetails)
                    }
                    let uploadToken = await photosAPI.requestUploadToken(tokenDetails.access_token, fileName, buffer)
                    photosAPI.uploadMedias(tokenDetails.access_token, [{
                        description: "Photosync",
                        simpleMediaItem: {
                            fileName: fileName,
                            uploadToken: uploadToken
                        }
                    }]).then((_) => {
                        console.log("Successfully uploaded to Google Photos")
                    }).catch(console.log)
                }
            })
        }
    })
}

export default hookEventWithUpload