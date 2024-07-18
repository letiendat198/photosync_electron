import fs from 'node:fs'

type callbackFunction = (event: string, fileName: string | null) => void

interface watchObject{
    path: string,
    abort: AbortController
}

var currentlyWatching: watchObject[] = [] // Global tracker

function startWatcher(path: string, callback: callbackFunction){
    const abortController = new AbortController()
    fs.watch(path, {signal: abortController.signal}, (eventType, fileName) => callback(eventType, fileName))
    let watchObj = {
        path: path,
        abort: abortController
    }
    currentlyWatching.push(watchObj)
}

function stopWatcher(path: string){
    currentlyWatching.forEach((watchObj) => {
        if (watchObj.path == path){
            watchObj.abort.abort()
            console.log("Watcher for %s has been aborted", path)
        }
    })
}

function saveToJson(path: string){
    let watchList = JSON.stringify(currentlyWatching)
    fs.writeFile(path, watchList, {flag: 'w'}, (err)=>{
        if (err){
            console.log("Failed to save watch list to", path)
        }
        else console.log("Saved current watch list to", path)
    })
}

function loadFromJson(path: string){
    fs.readFile(path, {flag: 'rx'}, (err, data) => {
        if (err){
            console.log("File doesn't exist!")
        }
        else{
            currentlyWatching = JSON.parse(data.toString())
            console.log("Current watch list updated from source", path)
        }
    })
}

const watch = {
    startWatcher,
    stopWatcher,
    saveToJson,
    loadFromJson
}

export default watch