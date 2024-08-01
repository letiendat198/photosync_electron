import oauth from "./oauth";
import storage from "./storage";
import ipc from '../ipcHandle'
import oauthCodeListener from "./oauth_listener";
import { ipcMain } from "electron";

async function installedFlow(client_id: string, client_secret: string){
    // Get OAuth code
    ipc.mainToRenderIPC('event:modalTextUpdate', "Waiting for user approval")
    oauth.requestOauthToken(client_id)
    let code: string | null = null
    try{
        code = await oauthCodeListener() 
        console.log(code)  
    }
    catch(err){
        ipc.mainToRenderIPC('event:setupFail', String(err))
        return
    }
    // Exchange OAuth code for Access Token
    ipc.mainToRenderIPC('event:modalTextUpdate', "Getting Access Token from Google")

    if (code!=null){
        try {
            let accessToken = await oauth.exchangeToken(client_id, client_secret, code)
            console.log(accessToken)
            storage.storeAccessToken(accessToken)    
            // Done
            ipc.mainToRenderIPC('event:modalTextUpdate', "Done")
            ipc.mainToRenderIPC('event:setupComplete', null)  
        }
        catch(err){
            ipc.mainToRenderIPC('event:setupFail', String(err))
        }
    }
    else {
        ipc.mainToRenderIPC("event:setupFail", "Error: No code was ever returned")
    }
}

export default installedFlow