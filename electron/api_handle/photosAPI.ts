import http from 'node:http'
import mime from 'mime'
import storage from '../oauth/storage'
import ipc from '../ipcHandle'
import oauth from '../oauth/oauth'


var allowedImageTypes = ['AVIF', 'BMP', 'GIF', 'HEIC', 'ICO', 'JPG', 'PNG', 'TIFF', 'WEBP', 'RAW'] 
var allowedVideoTypes = ['3GP', '3G2', 'ASF', 'AVI', 'DIVX', 'M2T', 'M2TS', 'M4V', 'MKV', 'MMV', 'MOD', 'MOV', 'MP4', 'MPG', 'MTS', 'TOD', 'WMV']

interface mediaItem {
    description: string,
    simpleMediaItem: {
        fileName: string,
        uploadToken: string
    }
}

async function requestUploadToken(oauthToken: string, fileName: string, fileBytes: Buffer): Promise<any>{
    let url = new URL("https://photoslibrary.googleapis.com/v1/uploads")
    let mimeType: string|null = null

    let nameParts = fileName.split(".")
    let ext = nameParts[nameParts.length - 1].toUpperCase()
    if (allowedImageTypes.includes(ext) || allowedVideoTypes.includes(ext)){
        mimeType = mime.getType(ext)
        console.log(mimeType)
    }

    return new Promise((resolve, reject) => {
        if (mimeType==null){
            reject(new Error("Unknown MIME type"))
            return
        }

        let timer = setTimeout(()=>reject(new Error("Request timeout")), 2*60000)
        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + oauthToken,
                'Content-type': 'application/octet-stream',
                'X-Goog-Upload-Content-Type': mimeType,
                'X-Goog-Upload-Protocol': 'raw'
            },
            body: fileBytes
        }).then((res) => res.text()).then((data) => {
            clearTimeout(timer)
            resolve(data)
        })    
    })
}

async function uploadMedias(oauthToken: string, mediaItems: mediaItem[]): Promise<any>{
    let url = new URL("https://photoslibrary.googleapis.com/v1/mediaItems:batchCreate")
    return new Promise((resolve, reject) => {
        let timer = setTimeout(()=>reject(new Error("Request timeout")), 2*60000)
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + oauthToken
            },
            body: JSON.stringify({
                newMediaItems: mediaItems
            })
        }).then((res) => {
            if (res.ok || res.status == 207){
                return res.json()
            }
            else{
                reject(res.status)
            }
        }).then((data) => {
            if (data instanceof Object){
                resolve(data)
            }
        })
    })
}

const photosAPI = {
    uploadMedias,
    requestUploadToken
}

export default photosAPI