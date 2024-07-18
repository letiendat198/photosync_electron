import fs from 'node:fs'

function storeClient(client_id: string, client_secret: string){
    let data = {
        client_id: client_id,
        client_secret: client_secret,
    }
    fs.writeFile('secret.json', JSON.stringify(data), {}, (err) => {
        if (err){
            console.log("Failed to store client details:",err)
        }
        else console.log("Stored client details at secret.json")
    })
}

function loadClient(): Promise<any>{
    return new Promise((resolve, reject) => {
        fs.readFile('secret.json', {flag: 'r'}, (err, data) => {
            if (err){
                console.log(err)
                reject(err)
            }
            else{
                let clientDetails = JSON.parse(data.toString())
                resolve(clientDetails)
            }
        })
    })

}

function storeAccessToken(accessTokenJson: any, refreshToken: string|null = null){
    if (accessTokenJson.refresh_token == null){
        if (refreshToken != null) accessTokenJson.refresh_token = refreshToken
        else{
            throw(new Error("Need to supply refresh_token"))
        }
    }
    fs.writeFile('token.json', JSON.stringify(accessTokenJson), {}, (err) =>{
        if (err){
            console.log(err)
        }
        else{
            console.log('Stored access token details in token.json')
        }
    })
}

function loadAccessToken(): Promise<any>{
    return new Promise((resolve, reject) => {
        fs.readFile('token.json', {flag:'r'}, (err, data) => {
            if (err){
                console.log(err)
                reject(err)
            }
            else{
                resolve(JSON.parse(data.toString()))
            }
        })
    })

}

const storage = {
    storeClient,
    loadClient,
    storeAccessToken,
    loadAccessToken
}

export default storage