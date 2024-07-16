import https from 'https'
import querystring from 'querystring' 
import shell from 'electron'
import crypto from 'crypto'
import {Worker} from 'worker_threads'


function request(client_id: string){
    const oauthEndpoint = "https://accounts.google.com/o/oauth2/v2/auth"

    const redirectUri = "http://localhost:1908"

    const params = {
    "client_id": client_id,
    "response_type": "code",
    "scope": "https://www.googleapis.com/auth/photoslibrary.appendonly",
    "redirect_uri": redirectUri
    }

    const urlParams: string = querystring.stringify(params)

    const requestUrl: string = oauthEndpoint + "?" + urlParams

    console.log(requestUrl)

    shell.shell.openExternal(requestUrl)
}

function setupOauthCodeListener(callback: any){
    const worker = new Worker("./dist-electron/oauth_listener.js")
    worker.on('message', (data) => {
        callback(data)
        worker.terminate()
    })
}

function exchangeToken(client_id: string, client_secret: string, code: string){
    const tokenEndpoint = "https://oauth2.googleapis.com/token"

    const redirectUri = "http://localhost:1909"

    const params = {
    "client_id": client_id,
    "client_secret": client_secret,
    "code": code,
    "grant_type": "authorization_code",
    "redirect_uri": redirectUri
    }

    const urlParams: string = querystring.stringify(params)

    const requestUrl: string = tokenEndpoint + "?" + urlParams

    console.log(requestUrl)

    shell.shell.openExternal(requestUrl)
}

function setupTokenListener(callback: any){
    const worker = new Worker("./dist-electron/token_listener.js")
    worker.on('message', (data) => {
        callback(data)
        worker.terminate()
    })
}

const oauth = {
    request,
    exchangeToken,
    setupOauthCodeListener,
    setupTokenListener,
}

export default oauth