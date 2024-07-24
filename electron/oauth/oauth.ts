import https from 'https'
import querystring from 'querystring' 
import shell from 'electron'
import crypto from 'crypto'
import oauthCodeListener from './oauth_listener'
import {Worker} from 'worker_threads'

function requestOauthToken(client_id: string){
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

function exchangeToken(client_id: string, client_secret: string, code: string): Promise<any>{
    const tokenEndpoint = "https://oauth2.googleapis.com/token"

    const redirectUri = "http://localhost:1908"

    const params = {
    "client_id": client_id,
    "client_secret": client_secret,
    "code": code,
    "grant_type": "authorization_code",
    "redirect_uri": redirectUri
    }

    const urlParams: string = querystring.stringify(params)

    return new Promise((resolve, reject) => {
        let timer = setTimeout(()=>reject(new Error("Request timeout")), 5*60000)
        fetch(tokenEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: urlParams
        }).then((res) => res.json()).then((res) => {
            console.log(res)
            clearTimeout(timer)
            try {
                let tokenDetails = {
                    access_token: res.access_token,
                    expires_in: (res.expires_in - 10) + Math.round(Date.now()/1000),
                    refresh_token: res.refresh_token
                } 
                resolve(tokenDetails)
            }
            catch(e){
                reject(e)
            }
        })
    })
    
}

function refreshToken(clientId: string, clientSecret: string, refreshToken: string): Promise<any>{
    const refreshEndpoint = new URL("https://oauth2.googleapis.com/token")
    let body = {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "refresh_token",
        refresh_token: refreshToken
    }

    return new Promise((resolve, reject) => {
        let timer = setTimeout(()=>reject(new Error("Request timeout")), 5*60000)
        fetch(refreshEndpoint, {
            method: 'POST',
            body: JSON.stringify(body)
        }).then((res) => res.json()).then((res) => {
            clearTimeout(timer)
            res.refresh_token = refreshToken // Add refresh_token back in cause response don't contain it
            res.expires_in = (res.expires_in - 10) + Math.round(Date.now()/1000)
            resolve(res)
        })
    })

    
}

const oauth = {
    requestOauthToken,
    exchangeToken,
    refreshToken
}

export default oauth