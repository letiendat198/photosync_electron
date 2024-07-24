import fs from 'node:fs'

type callbackFunction = (event: string, fileName: string | null) => void

interface watchObject{
    path: string,
    abort: AbortController
}

var currentWatchList: watchObject[] = [] // Global tracker

function startWatcher(path: string, callback: callbackFunction){
    const abortController = new AbortController()
    fs.watch(path, {signal: abortController.signal}, (eventType, fileName) => callback(eventType, fileName))
    let watchObj = {
        path: path,
        abort: abortController
    }
    currentWatchList.push(watchObj)
    saveToJson()
}

function stopWatcher(path: string){
    currentWatchList.forEach((watchObj, index) => {
        if (watchObj.path == path){
            watchObj.abort.abort()
            console.log("Watcher for %s has been aborted", path)
            currentWatchList.splice(index, 1)
            return
        }
    })
    console.log("Watch list after removal:", currentWatchList)
}

function getSimpleWatchList(): Promise<string[]>{
    let simpleWatchList: string[] = []
    return new Promise((resolve, reject) => {
        if (currentWatchList.length == 0) resolve(simpleWatchList)
        currentWatchList.forEach((watchObj, index) => {
            simpleWatchList.push(watchObj.path)
            if (index == currentWatchList.length - 1) resolve(simpleWatchList)
        })
    })
}

async function saveToJson(){
    let watchList = JSON.stringify(await getSimpleWatchList())
    fs.writeFile('watch.json', watchList, {flag: 'w'}, (err)=>{
        if (err){
            console.log("Failed to save watch list to watch.json")
        }
        else console.log("Saved current watch list to watch.json")
    })
}

function loadFromJson(): Promise<any>{
    return new Promise((resolve, reject) => {
        fs.readFile('watch.json', {flag: 'r'}, (err, data) => {
            if (err){
                console.log("File doesn't exist!")
                reject(err)
            }
            else{
                resolve(JSON.parse(data.toString()))
                console.log("Current watch list updated from source watch.json")
            }
        })    
    })
    
}

const watch = {
    startWatcher,
    stopWatcher,
    getSimpleWatchList,
    saveToJson,
    loadFromJson
}

export default watch