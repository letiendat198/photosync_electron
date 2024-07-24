import oauth from "./oauth";
import storage from "./storage";
import ipc from '../ipcHandle'
import oauthCodeListener from "./oauth_listener";

async function installedFlow(client_id: string, client_secret: string){
    // Get OAuth code
    ipc.mainToRenderIPC('event:modalTextUpdate', "Waiting for user approval")

    oauth.requestOauthToken(client_id)
    let code = await oauthCodeListener() 
    console.log(code)
    // Exchange OAuth code for Access Token
    ipc.mainToRenderIPC('event:modalTextUpdate', "Getting Access Token from Google")

    let accessToken = await oauth.exchangeToken(client_id, client_secret, code)
    console.log(accessToken)
    storage.storeAccessToken(accessToken)
    // Done
    ipc.mainToRenderIPC('event:modalTextUpdate', "Done")
    ipc.mainToRenderIPC('event:setupComplete', null)
}

export default installedFlow